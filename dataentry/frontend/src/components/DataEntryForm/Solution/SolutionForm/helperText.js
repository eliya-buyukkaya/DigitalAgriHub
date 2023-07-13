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
* @author Ronnie van Kempen  (ronnie.vankempen@wur.nl)
* @author Marlies de Keizer (marlies.dekeizer@wur.nl)
* @author Eliya Buyukkaya (eliya.buyukkaya@wur.nl)
*/

import {
  OptionHeader,
  OptionExplanation,
  PrimaryOptionHeader,
  OptionExplanationExample,
} from "../../../HelperText";
import ExternalLink from "../../../Link/ExternalLink";

export const helperTextsubUseCases = {
  "Farm management & Advisory": (
    <div>
      <PrimaryOptionHeader>Farm management & Advisory</PrimaryOptionHeader>
      <OptionHeader>Farm management & record keeping</OptionHeader>
      <OptionExplanation>
        Farm management software solutions for smallholder farmers featuring
        interactive tools/applications for farmers or agents interfacing with
        the farmers that go beyond the delivery of tailored recommendations to
        specific farms. They empower farmers to make their own decisions with
        tools like (i) farm budgeting and planning (e.g. pro forma upside
        implications and risks of specific farm investments based on market
        conditions and/or historical farm performance); (ii) farm monitoring
        (e.g. dynamic yield and economic projections); and (iii) financial
        management, accounting, and record-keeping.
      </OptionExplanation>
      <OptionHeader>Farmer information services</OptionHeader>
      <OptionExplanation>
        Services that provide generic advisory information, that is not
        specifically tailored to individual farms/farmers and localized field
        level agroclimatic conditions.
      </OptionExplanation>
      <OptionHeader>Participatory advisory</OptionHeader>
      <OptionExplanation>
        Participatory advisory solutions feature tight feedback loops between
        content providers and end-users, greater levels of farmer interactivity
        with the solution (i.e. not just one-way information flows from experts
        to farmers), and possibly a role – direct or indirect – for farmers in
        creating or customising advisory content. It includes peer-to-peer
        advisory solutions, which put individual farmers and farmer experts into
        more central roles for content creation and dissemination.
      </OptionExplanation>
      <OptionHeader>Precision agriculture advisory</OptionHeader>
      <OptionExplanation>
        Precision agriculture advisory services represent recommendations
        tailored to individual farms/farmers and localized field level
        agroclimatic conditions (e.g. weather, soil, etc.), crop varietals, and
        the economic setting of the farm (e.g. input prices, market prices, and
        market distances).
      </OptionExplanation>
    </div>
  ),
  "Market linkage": (
    <div>
      <PrimaryOptionHeader>Market linkage</PrimaryOptionHeader>
      <OptionHeader>Digitally-enabled value chain integration</OptionHeader>
      <OptionExplanation>
        Digitally-enabled value chain integrators are D4Ag solutions that use
        digital tools combined with either in-house or third-party human agents
        to link agricultural markets. At the core of these models is the
        ambition to capture value and generate impact for both smallholder
        farmers and agribusinesses by formalising currently fragmented and
        informal value chains.
      </OptionExplanation>
      <OptionHeader>E-commerce services</OptionHeader>
      <OptionExplanation>
        Agriculture e-commerce services are online retailers of agricultural
        produce for urban consumers or agricultural inputs for smallholder
        farmers; they rely on online order fulfilment via either shipping or a
        combination of online and offline (i.e. brick and mortar store)
        footprints.
      </OptionExplanation>
      <OptionHeader>Mechanisation access services</OptionHeader>
      <OptionExplanation>
        Digital solutions that extend farmer access to agricultural machinery or
        mechanised farm services (e.g. irrigation, tractors, cold storage).
      </OptionExplanation>
    </div>
  ),
  "Supply Chain Management": (
    <div>
      <PrimaryOptionHeader>Supply Chain Management</PrimaryOptionHeader>
      <OptionHeader>Input quality assurance & anti-counterfeiting</OptionHeader>
      <OptionExplanation>
        Digital services and tools designed to enable farmers to validate the
        authenticity of agriculture inputs such as seeds, fertilisers, agro
        chemicals and other agro inputs and prevent the proliferation of
        counterfeit products. They help agribusinesses ensure the integrity of
        their brands and help farmers validate the authenticity and quality of
        received inputs.
      </OptionExplanation>
      <OptionHeader>Logistics</OptionHeader>
      <OptionExplanation>
        Digital services and tools that support the surveillance and operational
        improvement of physical storage and transport infrastructure and, in
        particular, the transport of agricultural products across the full span
        of the value chain from producers to markets.
      </OptionExplanation>
      <OptionHeader>Procurement</OptionHeader>
      <OptionExplanation>
        Digital services and tools that support the procurement process by
        digitising transactions between the farmer and suppliers and buyers of
        products and goods.
      </OptionExplanation>
      <OptionHeader>Traceability & certification</OptionHeader>
      <OptionExplanation>
        Digital traceability and certification solutions help agribusinesses
        onboard farmers, document farm compliance with standards, and trace
        produce across value chains with higher fidelity and lower costs.
      </OptionExplanation>
    </div>
  ),
  Finance: (
    <div>
      <PrimaryOptionHeader>Finance</PrimaryOptionHeader>
      <OptionHeader> Credit scoring</OptionHeader>
      <OptionExplanation>
        Services that provide digitally-enabled automated credit scoring using
        aggregated data from multiple sources.
      </OptionExplanation>
      <OptionHeader>Credits & loans</OptionHeader>
      <OptionExplanation>
        Digital lending products specifically designed for farmers and
        digitalised elements of lenders’ operations (e.g. digitally branded
        credit products that involve little or no in-person farmer engagement,
        digital communications for client acquisition and servicing, digital
        payments for loan disbursement and payment collections).
      </OptionExplanation>
      <OptionHeader>Crowdfunding</OptionHeader>
      <OptionExplanation>
        Digital platforms to link farmers who need capital with sponsors who
        wish to invest; a form of ‘crowd-sourced’ financing in the agriculture
        context.
      </OptionExplanation>
      <OptionHeader>Insurance</OptionHeader>
      <OptionExplanation>
        Digitally-enabled agricultural insurance services that help smallholder
        farmers mitigate the risks associated with external shocks such as
        weather events and pest and disease outbreaks.
      </OptionExplanation>
      <OptionHeader>Payments</OptionHeader>
      <OptionExplanation>
        Digital payment services that allow smallholder farmers, input
        providers, buyers and others to exchange money with each other without
        cash.
      </OptionExplanation>
      <OptionHeader>Savings</OptionHeader>
      <OptionExplanation>
        Digital savings services ensure expenditure smoothing across variable
        seasonal income patterns, to make farm investments, and to build
        household resilience in the face of agriculture-related shocks (e.g.
        pest/disease infestations) or personal financial crises (e.g.
        unanticipated health expenditures).
      </OptionExplanation>
    </div>
  ),
  "Ecosystem support": (
    <div>
      <PrimaryOptionHeader>Ecosystem support</PrimaryOptionHeader>
      <OptionExplanation>
        Ecosystem support has no sub use cases
      </OptionExplanation>
    </div>
  ),
  "Smart farming": (
    <div>
      <PrimaryOptionHeader>Smart farming</PrimaryOptionHeader>
      <OptionHeader>Smart crop management</OptionHeader>
      <OptionExplanation>
        Smart farming for crop management, meaning that plants get precisely the
        treatment they need, determined with great accuracy thanks to the latest
        technology.
      </OptionExplanation>
      <OptionHeader>Smart livestock management</OptionHeader>
      <OptionExplanation>
        Smart farming for livestock management, meaning that animals get
        precisely the treatment they need, determined with great accuracy thanks
        to the latest technology.
      </OptionExplanation>
    </div>
  ),
};

const helperTextObjects = {
  name: {
    text: "The name of the deployed digital solution",
  },
  url: {
    text: "The URL of the webpage where the deployed solution is introduced.",
  },
  description: {
    text: "A short description of the characteristics and objectives of the digital solution",
  },
  launch: {
    text: "The year that the solution was introduced to the market ",
  },
  sectors: {
    text: "The agriculture sector(s) that the digital solution is primarily supporting",
    more: (
      <div>
        <OptionHeader>Crop farming</OptionHeader>
        <OptionExplanation>
          Crop farming is the cultivation of plants for food, animal foodstuffs,
          or other commercial uses.
        </OptionExplanation>
        <OptionHeader>Livestock</OptionHeader>
        <OptionExplanation>
          Livestock are the domesticated animals raised in an agricultural
          setting to provide labor and produce commodities such as meat, eggs,
          milk, fur, leather, and wool.
        </OptionExplanation>
        <OptionHeader>Agroforestry</OptionHeader>
        <OptionExplanation>
          Agroforestry is a collective name for land-use systems and
          technologies where woody perennials (trees, shrubs, palms, bamboos,
          etc.) are deliberately used on the same land-management units as
          agricultural crops and/or animals, in some form of spatial arrangement
          or temporal sequence.
        </OptionExplanation>
        <OptionHeader>Aquaculture</OptionHeader>
        <OptionExplanation>
          Aquaculture or farming in water is the aquatic equivalent of
          agriculture or farming on land. Aquaculture covers the farming of both
          animals (including crustaceans, finfish and molluscs) and plants
          (including seaweeds and freshwater macrophytes). Aquaculture occurs in
          both inland (freshwater) and coastal (brackishwater, seawater) areas.
        </OptionExplanation>
        <OptionHeader>Multi-sectoral or sector-independent</OptionHeader>
        <OptionExplanation>
          This code covers the D4Ag solutions that do not target a specific
          sector or that target multiple of the above sectors.
        </OptionExplanation>
      </div>
    ),
  },
  businessModels: {
    text: "The business model(s) that the digital solution is based on.",
    more: (
      <div>
        <OptionHeader>Business to consumer</OptionHeader>
        <OptionExplanation>
          Business to consumer refers to the process of selling products and services directly between 
          a business and consumers who are the end-users of its products or services.
        </OptionExplanation>
        <OptionHeader>Business to business</OptionHeader>
        <OptionExplanation>
          Business to business refers to the process of selling products and services between businesses.
        </OptionExplanation>
        <OptionHeader>Business to government</OptionHeader>
        <OptionExplanation>
          Business to government refers to the process of selling products and services between a business 
          and a public organisation.
        </OptionExplanation>
      </div>
    ),
  },
  platform: {
    text: "Tick box if the digital solution is a platform.",
    more: (
      <div>
        <OptionHeader>Platform</OptionHeader>
        <OptionExplanation>
          Tick box if the digital solution is a platform.
        </OptionExplanation>
        <OptionExplanation>
          We define a platform as a service delivery model that creates value by
          giving access to “a network of digital solutions and services” thus
          facilitating direct mutual interactions between multiple solution
          providers and multiple user groups (e.g. farmers, other value chain
          actors).
        </OptionExplanation>
      </div>
    ),
  },
  bundling: {
    text: "Tick box if the digital solution is marketed as a bundle of products or services.",
    more: (
      <div>
        <OptionHeader>Bundling</OptionHeader>
        <OptionExplanation>
          Tick box if the digital solution is marketed as a bundle of products or services.
        </OptionExplanation>
        <OptionExplanation>
          We define bundling as a marketing strategy aimed at developing
          holistic end-to-end solutions to address multiple pain points for
          farmers and value chain actors. It is delivered as a comprehensive
          package of digital products and services, sold as a single combined
          unit, offering broader, more holistic support for (smallholder)
          farmers and other value chain actors.
        </OptionExplanation>
      </div>
    ),
  },
  primaryUseCase: {
    text: "The main use case that is supported by the digital solution.",
  },
  primaryUseCaseUseCase: {
    text: "",
    more: (
      <div>
        <OptionHeader>Primary & secondary use cases</OptionHeader>
        <OptionExplanation>
          The main use case that is supported by the digital solution, and
          additional, secondary use cases that are supported by the digital
          solution.
        </OptionExplanation>
        <OptionExplanation>
          We define a use case as the specific field of application where users
          use a D4Ag solution or platform to improve their operations towards
          achieving their objectives.
        </OptionExplanation>
        <OptionHeader>Farm management & advisory</OptionHeader>
        <OptionExplanation>
          Digitally-enabled information services and farm management software on
          topics such as agronomic best practices, pests and diseases, weather,
          and market prices, including services tailored to the specific farmer,
          farm, or field that enable smallholder farmers to make decisions that
          maximise output from their land, improve the quality of agricultural
          production, and maximise farm revenues and profits via lower costs of
          production, improved ability to identify markets, and/or better price
          realisation.
        </OptionExplanation>
        <OptionHeader>Market linkage</OptionHeader>
        <OptionExplanation>
          Digitally-enabled solutions that link smallholder farmers to farm
          inputs (e.g. seeds, fertilisers, herbicides/pesticides), to production
          and post-harvest mechanisation and other services (e.g. irrigation,
          tractors, cold storage), or to off-take markets, including
          agro-dealers, wholesalers, retailers, or even to the end-consumer.
        </OptionExplanation>
        <OptionHeader>Supply chain management </OptionHeader>
        <OptionExplanation>
          Digital supply chain management solutions are business-to-business
          services that help agribusinesses, cooperatives, nucleus farms, input
          agro-dealers, and other smallholder farmer value chain intermediaries
          to manage the flow of goods and services across the supply chain.
        </OptionExplanation>
        <OptionHeader>Finance</OptionHeader>
        <OptionExplanation>
          Digitally-enabled financial services relevant for smallholder farmers,
          such as digital payments, savings, smallholder credit, and
          agricultural insurance, which increase financial access and equip
          smallholder farmers to improve yields and incomes and invest in the
          longer-term growth of their farms.
        </OptionExplanation>
        <OptionHeader>Ecosystem support</OptionHeader>
        <OptionExplanation>
          Data analytics solutions and digital decision support tools that
          integrate data sources on smallholder farmers, farms, and markets and
          convert this information into useful higher level (e.g. country- and
          value-chain-level) insights and decision tools, supporting for example
          government policymakers, extension agencies, researchers,
          agribusinesses, or investors.
        </OptionExplanation>
        <OptionHeader>Smart farming</OptionHeader>
        <OptionExplanation>
          Digital solutions that provide tailored actions for smallholder
          farmers on a precise scale. For this it uses advanced technology –
          including big data, the cloud and Internet of Things (IoT) – for
          tracking, monitoring, automating and analyzing.
        </OptionExplanation>
      </div>
    ),
  },
  primaryUseCaseSubUseCase: {
    text: "The most relevant sub use case.",
    more: (
      <div style={{ fontStyle: "italic" }}>
        <OptionHeader>Sub use cases of the primary use case</OptionHeader>
        <OptionExplanation>
          The most relevant sub use case that is supported by the digital
          solution as part of the primary use case
        </OptionExplanation>
      </div>
    ),
  },
  otherUseCases: {
    text: "Additional, secondary use cases that are supported by the digital solution.",
  },
  otherUseCasesSubUseCase: {
    text: `The most relevant sub use cases (max. 2 per use case).`,
    more: (
      <div style={{ fontStyle: "italic" }}>
        <OptionHeader>Sub use cases of the secondary use cases</OptionHeader>
        <OptionExplanation>
          The most relevant sub use cases that are supported by the digital
          solution as part of the secondary use cases (maximum 2 per individual
          use case)
        </OptionExplanation>
      </div>
    ),
  },
  channels: {
    text: "The method or medium that is used by the digital solution or platform to provide information to users or for interaction between users (maximum 3)",
    more: (
      <div>
        <OptionHeader>Augmented/Virtual reality</OptionHeader>
        <OptionExplanation>
          Adding simulated elements to the real visual world.
        </OptionExplanation>
        <OptionExplanation>
          Virtual reality (VR): simulated experience that can be similar to or
          completely different from the real world.
        </OptionExplanation>
        <OptionExplanation>
          Augmented reality (AR): a system that incorporates a combination of
          real and virtual worlds, real-time interaction, and accurate 3D
          registration of virtual and real objects.
        </OptionExplanation>
        <OptionHeader>Call center support</OptionHeader>
        <OptionExplanation>
          Providing technical support, customer service and sales assistance by
          phone.
        </OptionExplanation>
        <OptionHeader>Chatbots</OptionHeader>
        <OptionExplanation>
          Software applications which do on-line chat conversations via text or
          text-to-speech.
        </OptionExplanation>
        <OptionHeader>E-learning</OptionHeader>
        <OptionExplanation>
          Learning conducted via electronic media, typically on the internet.
        </OptionExplanation>
        <OptionHeader>Email</OptionHeader>
        <OptionExplanation>
          Messages distributed by electronic means from one computer user to one
          or more recipients via a network.
        </OptionExplanation>
        <OptionHeader>Gaming</OptionHeader>
        <OptionExplanation>
          Playing electronic (serious) games.
        </OptionExplanation>
        <OptionHeader>Instant messaging</OptionHeader>
        <OptionExplanation>
          Type of online chat allowing real-time text transmission over the
          internet or another computer network.
        </OptionExplanation>
        <OptionHeader>Interactive Voice Response (IVR)</OptionHeader>
        <OptionExplanation>
          Allows humans to interact with a computer-operated phone system
          through the use of voice and DTMF tones (touch tones) input via a
          keypad. In telecommunications, IVR allows customers to interact with a
          company’s host system via a telephone keypad or by speech recognition,
          after which services can be inquired about through the IVR dialogue.
        </OptionExplanation>
        <OptionHeader>Mobile applications</OptionHeader>
        <OptionExplanation>
          A mobile application, most commonly referred to as an app, is a type
          of application software designed to run on a mobile device, such as a
          smartphone or tablet computer.
        </OptionExplanation>
        <OptionHeader>Outbound dialing</OptionHeader>
        <OptionExplanation>
          Outbound Dialing (OBD) is a robust system designed to effectively
          manage mobile service-provider-initiated outbound calls. The system
          automatically dials out calls to a list of mobile users provided by
          the telecom operator.
        </OptionExplanation>
        <OptionHeader>Radio broadcasting</OptionHeader>
        <OptionExplanation>
          Transmission of audio (sound), sometimes with related metadata, by
          radio waves intended to reach a wide audience. The listener must have
          a broadcast radio receiver (radio).
        </OptionExplanation>
        <OptionHeader>Rich media</OptionHeader>
        <OptionExplanation>
          Rich media indicates the use of advanced features like video. In
          telecoms, rich media refers to the use of Multimedia Messaging Service
          (MMS) and Rich Communication Services (RCS).
        </OptionExplanation>
        <OptionHeader>SMS</OptionHeader>
        <OptionExplanation>Short Message Service</OptionExplanation>
        <OptionHeader>Social media</OptionHeader>
        <OptionExplanation>
          Interactive technologies that allow the creation or sharing/exchange
          of information, ideas, interests, and other forms of expression via
          virtual communities and networks.
        </OptionExplanation>
        <OptionHeader>TV broadcasting</OptionHeader>
        <OptionExplanation>
          Analogue or digital transmission of the audiovisual signals to the
          final user.
        </OptionExplanation>
        <OptionHeader>USSD</OptionHeader>
        <OptionExplanation>
          Unstructured Supplementary Service Data, sometimes referred to as
          "quick codes" or "feature codes", is a communications protocol used by
          GSM cellular telephones to communicate with the mobile network
          operator's computers. Unlike SMS messages, USSD messages create a
          real-time connection during a USSD session. The connection remains
          open, allowing a two-way exchange of a sequence of data.
        </OptionExplanation>
        <OptionHeader>Video</OptionHeader>
        <OptionExplanation>
          Videos integrating contents curated by agronomist and extension
          specialists with farmer-generated contents.
        </OptionExplanation>
        <OptionHeader>Web-based applications</OptionHeader>
        <OptionExplanation>
          A web-based application is a type of application software designed to
          run in a browser.
        </OptionExplanation>
      </div>
    ),
  },
  technologies: {
    text: "Core technologies that are used by the digital solution to generate, store or process data in digital form (maximum 5).",
    more: (
      <div>
        <OptionHeader>Artificial Intelligence (AI)</OptionHeader>
        <OptionExplanation>
          Artificial Intelligence (AI) is about a system's ability to correctly
          interpret external data, to learn from such data, and to use those
          learnings to achieve specific goals and tasks through flexible
          adaptation.
        </OptionExplanation>
        <OptionExplanation>
          There are four categories: systems that think like humans, systems
          that act like humans, systems that think rationally and systems that
          act rationally.
        </OptionExplanation>
        <OptionHeader>Natural Language Processing (NLP)</OptionHeader>
        <OptionExplanation>
          Natural Language Processing (NLP) is an application of AI that
          provides systems which process and analyze large amounts of natural
          language data. The result is a computer capable of "understanding" the
          contents of documents, including the contextual nuances of the
          language within them. Accurately extract information and insights
          contained in documents as well as categorize and organize documents
          themselves.
        </OptionExplanation>
        <OptionHeader>Machine Learning (ML)</OptionHeader>
        <OptionExplanation>
          Machine-learning (ML) is an application of AI that provides systems
          the ability to automatically learn and improve from experience without
          being explicitly programmed.
        </OptionExplanation>
        <OptionHeader>Predictive modelling &amp; analytics</OptionHeader>
        <OptionExplanation>
          Predictive modelling &amp; analytics deals with extracting information
          from data and using it to predict trends and behavior patterns.
        </OptionExplanation>
        <OptionHeader>Data analytics &amp; Business Intelligence</OptionHeader>
        <OptionExplanation>
          Data analytics &amp; Business Intelligence is about systems that
          process and perform statistical analysis on existing sets of data. It
          curates relevant and meaningful insights from the data and finds
          answers and gains insights for problems that we know.
        </OptionExplanation>
        <OptionExplanation>
          This also contains IoT analytics, being the application of data
          analysis tools and procedures to realize value from the huge volumes
          of data generated by connected Internet of Things devices
        </OptionExplanation>
        <OptionHeader>Digital twins</OptionHeader>
        <OptionExplanation>
          A dynamic virtual representation of a physical object or system,
          usually across multiple stages of its lifecycle, that uses real-world
          data, simulation, or machine learning models combined with data
          analysis to enable understanding, learning, and reasoning. DT can be
          used to answer what-if questions and should be able to present
          insights in an intuitive way.
        </OptionExplanation>
        <OptionHeader>Virtual reality modelling</OptionHeader>
        <OptionExplanation>
          Virtual reality modelling is about designing and implementing the
          logic for virtual reality applications.
        </OptionExplanation>
        <OptionHeader>Data mining</OptionHeader>
        <OptionExplanation>
          Data mining is a process of extracting and discovering patterns in
          large data sets involving methods at the intersection of machine
          learning, statistics, and database systems.
        </OptionExplanation>
        <OptionHeader>Blockchain</OptionHeader>
        <OptionExplanation>
          Blockchain is a decentralised governance system with an incentive
          mechanism.
        </OptionExplanation>
        <OptionHeader>Geographic Information System (GIS)</OptionHeader>
        <OptionExplanation>
          Geographic Information System (GIS) is a computer system for
          capturing, storing, checking, and displaying data related to positions
          on Earth’s surface.
        </OptionExplanation>
        <OptionHeader>Location based services</OptionHeader>
        <OptionExplanation>
          Location based services are systems that use tracking based on GPS,
          mobile phone signals or other positioning methods.
        </OptionExplanation>
        <OptionHeader>Big Data</OptionHeader>
        <OptionExplanation>
          Although the term Big Data refers, in its narrower meaning, to ‘Large,
          diverse, complex’ volumes of data, it is usually extended to also
          incorporate the processing capabilities to aggregate, store and
          analyze the same data. Big data is produced in high speed (velocity),
          and needs to be processed (streaming data). This requires specific
          techniques (different than working with large volumes of stored data).
        </OptionExplanation>
        <OptionHeader>Cloud-based services</OptionHeader>
        <OptionExplanation>
          A cloud-based solution refers to applications, storage, on-demand
          services, computer networks, or other resources that are accessed with
          an internet connection through another provider's shared cloud
          computing framework. In farming, cloud computing can be used in
          aggregating data from tools like soil sensors, satellite images and
          weather stations. Used for big data analytics thanks to storage, speed
          and computing power capabilities.
        </OptionExplanation>
        <OptionHeader>Supercomputing</OptionHeader>
        <OptionExplanation>
          Supercomputing refers to the processing of massively complex or
          data-laden problems using the concentrated compute resources of
          multiple computer systems working in parallel.
        </OptionExplanation>
        <OptionHeader>Mobile field data collection devices</OptionHeader>
        <OptionExplanation>
          Devices which help in obtaining data directly from the location where
          event or transaction takes place. Data collection devices do not read
          or scan data from the source document.
        </OptionExplanation>
        <OptionHeader>
          Storage and logistics sensors and diagnostics equipment
        </OptionHeader>
        <OptionExplanationExample>
          (e.g. RFID, agriculture input testing tools)
        </OptionExplanationExample>
        <OptionExplanation>
          Storage and logistics sensors give direct measurements of measurands
          in storage locations and in logistics equipment like trucks and
          containers. Diagnostic equipment is specific software with models to
          ascertain the condition of agriculture inputs and any deficiencies
          (diagnostics).
        </OptionExplanation>
        <OptionHeader>Field sensors and diagnostics equipment</OptionHeader>
        <OptionExplanationExample>
          (e.g. farm field, livestock, agricultural machinery sensors, portable
          soil/crop testing tools)
        </OptionExplanationExample>
        <OptionExplanation>
          Field sensors give direct measurements of measurands in the field in
          its original place. Diagnostic equipment is specific software with
          decision rules and models to ascertain the condition of the crop or
          soil and any deficiencies or needs (diagnostics) and determine whether
          location-specific treatment is necessary and if so, which (decisions).
        </OptionExplanation>
        <OptionHeader>Weather stations</OptionHeader>
        <OptionExplanation>
          A weather station is an observation post where weather conditions and
          meteorological data are observed and recorded.
        </OptionExplanation>
        <OptionHeader>IoT devices + connectivity</OptionHeader>
        <OptionExplanation>
          The Internet of Things (IoT) refers to a system of interrelated,
          internet-connected objects that are able to collect and transfer data
          over a wireless network without human intervention
        </OptionExplanation>
        <OptionHeader>Remote sensing</OptionHeader>
        <OptionExplanation>
          Remote sensing points to aerial platforms and sensors generating fine
          grained, multi-spectral earth observations (EO). It includes aerial
          photography, i.e. technique of photographing the Earth's surface or
          features of its atmosphere or hydrosphere with cameras mounted on
          aircraft, rockets, or Earth-orbiting satellites and other spacecraft;
          and drones, i.e. unmanned airborne vehicles (UAVs) that are able to
          collect spatial information by flying over specific areas.
        </OptionExplanation>
        <OptionHeader>
          Satellites (incl. mini satellites, CubeSats, nanosatellites)
        </OptionHeader>
        <OptionExplanation>
          Artificial satellites creating imagery (scans - not photos) of Earth.
        </OptionExplanation>
        <OptionHeader>Drones</OptionHeader>
        <OptionExplanation>
          A drone or unmanned aerial vehicle (UAV) is an aircraft without any
          human pilot, crew, or passengers on board. The flight of drones may
          operate under remote control by a human operator, as remotely-piloted
          aircraft (RPA), or with various degrees of autonomy, such as autopilot
          assistance, up to fully autonomous aircraft that have no provision for
          human intervention.
        </OptionExplanation>
        <OptionHeader>Visualization</OptionHeader>
        <OptionExplanation>
          Visualization is about the graphical representation of information and
          data.
        </OptionExplanation>
        <OptionHeader>Robotics</OptionHeader>
        <OptionExplanation>
          Robotics refers to the branch of technology that deals with the
          design, construction, operation, and application of robots.
        </OptionExplanation>
        <OptionHeader>D4Ag infrastructure</OptionHeader>
        <OptionExplanation>
          D4Ag infrastructure, also sometimes referred to as D4Ag middleware
          infrastructure, includes agriculture sector specific data, hardware,
          and software infrastructure that D4Ag solutions rely on to source
          information and deliver their services to farmers and other
          agriculture intermediaries.
        </OptionExplanation>
      </div>
    ),
  },
  countriesRegions: {
    text: "The countries or regions where the digital solution is deployed and actively used.",
  },
  countries: {
    text: "Select country.",
    more: (
      <div>
        <OptionHeader>Countries</OptionHeader>
        <OptionExplanation>
          The countries where the digital solution is deployed and actively
          used. Countries can be chosen from the (ISO-3166-1 standard country
          coding) list of global countries.
        </OptionExplanation>
        <OptionExplanation>
          See: <ExternalLink href="https://www.iso.org/obp/ui/#search&3166" />
        </OptionExplanation>
        <OptionExplanation>
          Note that Digital Agri Hub through its specific focus will only
          provide and visualise deployments in low- and middle-income countries
          as published by the Worldbank:{" "}
          <ExternalLink href="https://data.worldbank.org/country/XO" />.
        </OptionExplanation>
      </div>
    ),
  },
  regions: {
    text: "The area(s) within a country, e.g. a province, county or administrative area where the digital solution is deployed and actively used.",
    more: (
      <div>
        <OptionHeader>Regions</OptionHeader>
        <OptionExplanation>
          Pick a predefined region if available. You can also add a new region
          by typing your own and select{" "}
          <span style={{ whiteSpace: "nowrap", fontStyle: "italic" }}>
            'Add "&lt;your&nbsp;region&gt;"'
          </span>{" "}
          from the dropdown.
        </OptionExplanation>
      </div>
    ),
  },
  languages: {
    text: "The language(s) in which the digital solution is provided to its users.",
    more: (
      <div>
        <OptionHeader>Languages</OptionHeader>
        <OptionExplanation>
          Pick from the predefined languages if available. You can also add a
          new language by typing your own and select{" "}
          <span style={{ whiteSpace: "nowrap", fontStyle: "italic" }}>
            'Add "&lt;your&nbsp;language&gt;"'
          </span>{" "}
          from the dropdown.
        </OptionExplanation>
      </div>
    ),
  },
  registeredusers: {
    text: "Number of users (individuals, or organisation representatives) that have registered",
    more: (
      <div>
        <OptionHeader>Registered users</OptionHeader>
        <OptionExplanation>
          The total number of registered users of the digital solution
        </OptionExplanation>
        <OptionExplanation>
          We define registered users as those users (individuals, or
          organisation representatives) that have registered (and have a
          valid/working account at the specific point in time) for the use of a
          digital solution or platform.
        </OptionExplanation>
      </div>
    ),
  },
  activeusers: {
    text: "Users regularly use the digital solution",
    more: (
      <div>
        <OptionHeader>Active users</OptionHeader>
        <OptionExplanation>
          The total number of active users of the digital solution
        </OptionExplanation>
        <OptionExplanation>
          Active users are users that regularly use the digital solution.
        </OptionExplanation>
        <OptionExplanation>
          Note: the meaning of “regular” should be interpreted in relation to
          the type of application offered, as these might vary from applications
          that are expected to be used on a daily basis, to applications that
          focus on e.g. once in a year or once in an occasion use.
        </OptionExplanation>
      </div>
    ),
  },
  shfusers: {
    text: "Individuals who produce crops or livestock on two or fewer hectares of land",
    more: (
      <div>
        <OptionHeader>Smallholder farmer users</OptionHeader>
        <OptionExplanation>
          The total number of smallholder farmer users (individuals who produce
          crops or livestock on two or fewer hectares of land) of the digital
          solution.
        </OptionExplanation>
      </div>
    ),
  },
  womenusers: {
    text: "The total number of female users of the digital solution.",
  },
  youthusers: {
    text: "Number of user users between the ages of 15 and 35 years",
    more: (
      <div>
        <OptionHeader>Youth users</OptionHeader>
        <OptionExplanation>
          The total number of youth users (between the ages of 15 and 35 years)
          of the digital solution
        </OptionExplanation>
      </div>
    ),
  },
  revenue: {
    text: "The yearly revenue (expressed in USD) of the digital solution",
  },
  yield: {
    text: "The expected growth of smallholder farmer yields through the use of the digital solution as a percentage of current average yields",
  },
  income: {
    text: "The expected growth of smallholder farmer income through the use of the digital solution as a percentage of current average income",
  },
  // key: {
  //   text: "mainexplanation",
  //   more: (
  //     <div>
  //       <OptionHeader>header</OptionHeader>
  //       <OptionExplanation>explanation</OptionExplanation>
  //     </div>
  //   ),
  // },
};

export default helperTextObjects;
