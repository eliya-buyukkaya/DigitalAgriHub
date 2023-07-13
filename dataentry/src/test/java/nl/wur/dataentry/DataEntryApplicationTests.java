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

import java.util.regex.Pattern;

import org.apache.commons.validator.routines.EmailValidator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DataEntryApplicationTests {
	private @LocalServerPort int port;
	private @Value("${dataentry.cors.url}") String urlCors;
	private @Value("${dataentry.frame.url}") String urlFrame;

	@Test
	public void testUrls() throws Exception {
		assertEquals(
				"\"http://localhost:8080\",\"http://localhost:3000\",\"https://digitalagrihub.org\",\"https://www.digitalagrihub.org\",\"https://digitalagrihub-test.containers.wur.nl\"",
				urlCors);
		assertEquals(
				"http://localhost:8080 http://localhost:3000 https://digitalagrihub.org https://www.digitalagrihub.org https://digitalagrihub-test.containers.wur.nl",
				urlFrame);
	}

	@Test
	public void testEmailValidator() {
		assertTrue(EmailValidator.getInstance().isValid("username@domain.com"));
		assertTrue(EmailValidator.getInstance().isValid("info@investingreen.energy"));
	}

	@Test
	public void testPatternEmailValidator() {
		String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
				+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
		Pattern PATTERN = Pattern.compile(EMAIL_PATTERN);
		assertTrue(PATTERN.matcher("username@domain.com").matches());
		assertTrue(PATTERN.matcher("info@investingreen.energy").matches());
	}
}
