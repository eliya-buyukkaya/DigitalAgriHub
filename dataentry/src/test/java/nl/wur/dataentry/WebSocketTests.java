/**
 * Copyright 2022 Wageningen Environmental Research, Wageningen UR
 * Licensed under the EUPL, Version 1.2 or as soon they
 * will be approved by the European Commission - subsequent
 * versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the
 * Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in
 * writing, software distributed under the Licence is
 * distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the Licence for the specific language governing
 * permissions and limitations under the Licence.
 */

/**
* @author Eliya Buyukkaya (eliya.buyukkaya@wur.nl)
*/

/**
 * Tests might need to be updated
 */

package nl.wur.dataentry;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import nl.wur.daghub.database.domain.User;
import nl.wur.daghub.database.repository.RepositorySolution;
import nl.wur.daghub.database.repository.RepositoryUser;
import nl.wur.dataentry.dto.DtoUser;
import nl.wur.dataentry.test.ResponseRest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebSocketTests {
	private @LocalServerPort int port;
	private SockJsClient sockJsClient;
	private WebSocketStompClient stompClient;
	private final WebSocketHttpHeaders headersWebsocket = new WebSocketHttpHeaders();
	private final HttpHeaders headersHttp = new HttpHeaders();
	private @Autowired TestRestTemplate restTemplate;
	private @Autowired RepositoryUser repositoryUser;
	private @Autowired RepositorySolution repositorySolution;
	private @Autowired PasswordEncoder passwordEncoder;
	private String href;
	private UsernamePasswordAuthenticationToken ownerAuth;

	@BeforeEach
	public void setup() {
		List<Transport> transports = new ArrayList<>();
		transports.add(new WebSocketTransport(new StandardWebSocketClient()));
		this.sockJsClient = new SockJsClient(transports);
		this.stompClient = new WebSocketStompClient(sockJsClient);
		// use MappingJackson2MessageConverter when a json is sent
		this.stompClient.setMessageConverter(new StringMessageConverter());

		String password = "Password12!";
		DtoUser dtoOwner = new DtoUser("name", password, password, "emailOwner@test.com", "company");
		User owner = dtoOwner.toUser(passwordEncoder);
		owner.setRoles(new String[] { "OWNER" });
		repositoryUser.save(owner);

		headersHttp.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);
		headersHttp.set("Cookie",
				"JSESSIONID=807BFB9152DC4B945801DD7AADF76F83; XSRF-TOKEN=e67fadfc-23ff-4477-8070-af4b9b59bb5d");
		headersHttp.set("X-XSRF-TOKEN", "e67fadfc-23ff-4477-8070-af4b9b59bb5d");

		ResponseEntity<ResponseRest> response = restTemplate.withBasicAuth("emailOwner@test.com", password).exchange(
				"http://localhost:" + port + "/dataentry/api/login", HttpMethod.POST,
				new HttpEntity<>(headersHttp), ResponseRest.class);
		String tokenOwner = response.getHeaders().get("Authorization").get(0);
		assertEquals(HttpStatus.OK, response.getStatusCode());

		headersHttp.add("Authorization", tokenOwner);
		headersWebsocket.add("Authorization", tokenOwner);

		ownerAuth = new UsernamePasswordAuthenticationToken(owner.getEmail(), owner.getPassword(),
				AuthorityUtils.createAuthorityList(owner.getRoles()));
	}

	@AfterEach
	private void afterEach() {
		SecurityContextHolder.getContext().setAuthentication(ownerAuth);
		repositorySolution.deleteById(Integer.parseInt(href.substring(href.lastIndexOf('/') + 1)));
		SecurityContextHolder.getContext().setAuthentication(null);
		String url = "http://localhost:" + port + "/dataentry/api/user";
		ResponseEntity<ResponseRest> response = restTemplate.exchange(url, HttpMethod.DELETE,
				new HttpEntity<>(headersHttp), ResponseRest.class);
		assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
	}

	@Test
	public void testSubscriptions() throws Exception {

		final CountDownLatch latch = new CountDownLatch(1);
		final AtomicReference<Throwable> failure = new AtomicReference<>();

		StompSessionHandler handler = new TestSessionHandler(failure) {

			@Override
			public void afterConnected(final StompSession session, StompHeaders connectedHeaders) {
				session.subscribe("/topic/newSolution", new StompFrameHandler() {
					@Override
					public Type getPayloadType(StompHeaders headers) {
						return String.class;
					}

					@Override
					public void handleFrame(StompHeaders headers, Object payload) {
						try {
							assertTrue(href.endsWith((String) payload));
						} catch (Throwable t) {
							failure.set(t);
						} finally {
							session.disconnect();
							latch.countDown();
						}
					}
				});

				session.subscribe("/topic/deleteSolution", new StompFrameHandler() {
					@Override
					public Type getPayloadType(StompHeaders headers) {
						return String.class;
					}

					@Override
					public void handleFrame(StompHeaders headers, Object payload) {
						try {
							assertTrue(href.endsWith((String) payload));
						} catch (Throwable t) {
							failure.set(t);
						} finally {
							session.disconnect();
							latch.countDown();
						}
					}
				});

				session.subscribe("/topic/updateSolution", new StompFrameHandler() {
					@Override
					public Type getPayloadType(StompHeaders headers) {
						return String.class;
					}

					@Override
					public void handleFrame(StompHeaders headers, Object payload) {
						try {
							assertTrue(href.endsWith((String) payload));
						} catch (Throwable t) {
							failure.set(t);
						}
					}
				});
				try {
					String url = "http://localhost:" + port + "/dataentry/rest/solutions";

					nl.wur.dataentry.test.Solution newSolution = new nl.wur.dataentry.test.Solution("test description",
							"url", "name", 2021, 1, 1, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010,
							"http://localhost:" + port + "/dataentry/rest/organisations/1",
							"http://localhost:" + port + "/dataentry/rest/subUseCases/1",
							"http://localhost:" + port + "/dataentry/rest/sectors/1",
							Arrays.asList("http://localhost:" + port + "/dataentry/rest/tags/1"),
							Arrays.asList("http://localhost:" + port + "/dataentry/rest/subUseCases/1",
									"http://localhost:" + port + "/dataentry/rest/subUseCases/2"),
							Arrays.asList("http://localhost:" + port + "/dataentry/rest/businessModels/1",
									"http://localhost:" + port + "/dataentry/rest/businessModels/2"),
							Arrays.asList("http://localhost:" + port + "/dataentry/rest/regions/1",
									"http://localhost:" + port + "/dataentry/rest/regions/2"));

					// NEW Solution
					ResponseEntity<ResponseRest> resultPost = restTemplate.exchange(url, HttpMethod.POST,
							new HttpEntity<>(newSolution, headersHttp), ResponseRest.class);
					assertEquals(HttpStatus.CREATED, resultPost.getStatusCode());
					assertEquals("test description", resultPost.getBody().getDescription());
					href = resultPost.getBody().get_links().getSelf().getHref();
					// // UPDATE Solution
					// headersHttp.set("If-Match", resultPost.getHeaders().get("ETag").get(0));
					// newSolution.setDescription("test description updated OK");
					// ResponseEntity<ResponseRest> resultPut = restTemplate.exchange(href,
					// HttpMethod.PUT,
					// new HttpEntity<>(newSolution, headersHttp), ResponseRest.class);
					// assertEquals(HttpStatus.OK, resultPut.getStatusCode());
					// assertEquals("test description updated OK",
					// resultPut.getBody().getDescription());
					// // DELETE Solution
					// headersHttp.remove("If-Match");
					// ResponseEntity<ResponseRest> resultDelete = restTemplate.exchange(href,
					// HttpMethod.DELETE,
					// new HttpEntity<>(headersHttp), ResponseRest.class);
					// assertEquals(HttpStatus.NO_CONTENT, resultDelete.getStatusCode());
					// assertNull(resultDelete.getBody());
				} catch (Throwable t) {
					failure.set(t);
					latch.countDown();
				}
			}
		};

		this.stompClient.connect("ws://localhost:{port}/dataentry/websocket", this.headersWebsocket, handler,
				this.port);

		if (latch.await(3, TimeUnit.SECONDS)) {
			if (failure.get() != null) {
				throw new AssertionError("", failure.get());
			}
		} else {
			fail("Solution not received");
		}

	}

	private class TestSessionHandler extends StompSessionHandlerAdapter {

		private final AtomicReference<Throwable> failure;

		public TestSessionHandler(AtomicReference<Throwable> failure) {
			this.failure = failure;
		}

		@Override
		public void handleFrame(StompHeaders headers, Object payload) {
			this.failure.set(new Exception(headers.toString()));
		}

		@Override
		public void handleException(StompSession s, StompCommand c, StompHeaders h, byte[] p, Throwable ex) {
			this.failure.set(ex);
		}

		@Override
		public void handleTransportError(StompSession session, Throwable ex) {
			this.failure.set(ex);
		}
	}
}
