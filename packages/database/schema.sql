-- business_funding_stages definition

-- Drop table

-- DROP TABLE business_funding_stages;

CREATE TABLE business_funding_stages (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT business_funding_stages_description_key UNIQUE (description),
	CONSTRAINT business_funding_stages_pkey PRIMARY KEY (id)
);


-- business_growth_stages definition

-- Drop table

-- DROP TABLE business_growth_stages;

CREATE TABLE business_growth_stages (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT business_growth_stages_description_key UNIQUE (description),
	CONSTRAINT business_growth_stages_pkey PRIMARY KEY (id)
);


-- business_models definition

-- Drop table

-- DROP TABLE business_models;

CREATE TABLE business_models (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT business_models_description_key UNIQUE (description),
	CONSTRAINT business_models_pkey PRIMARY KEY (id)
);


-- channels definition

-- Drop table

-- DROP TABLE channels;

CREATE TABLE channels (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT channels_description_key UNIQUE (description),
	CONSTRAINT channels_pkey PRIMARY KEY (id)
);


-- countries definition

-- Drop table

-- DROP TABLE countries;

CREATE TABLE countries (
	id text NOT NULL,
	description text NOT NULL,
	lmic bool NOT NULL,
	CONSTRAINT countries_description_key UNIQUE (description),
	CONSTRAINT countries_pkey PRIMARY KEY (id)
);


-- countryregions definition

-- Drop table

-- DROP TABLE countryregions;

CREATE TABLE countryregions (
	id serial4 NOT NULL,
	"label" text NOT NULL,
	description text NULL,
	CONSTRAINT countryregions_label_key UNIQUE (label),
	CONSTRAINT countryregions_pkey PRIMARY KEY (id)
);


-- languages definition

-- Drop table

-- DROP TABLE languages;

CREATE TABLE languages (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT languages_description_key UNIQUE (description),
	CONSTRAINT languages_pkey PRIMARY KEY (id)
);


-- organisation_types definition

-- Drop table

-- DROP TABLE organisation_types;

CREATE TABLE organisation_types (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT organisation_types_description_key UNIQUE (description),
	CONSTRAINT organisation_types_pkey PRIMARY KEY (id)
);


-- sectors definition

-- Drop table

-- DROP TABLE sectors;

CREATE TABLE sectors (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT sectors_description_key UNIQUE (description),
	CONSTRAINT sectors_pkey PRIMARY KEY (id)
);


-- tags definition

-- Drop table

-- DROP TABLE tags;

CREATE TABLE tags (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT tags_description_key UNIQUE (description),
	CONSTRAINT tags_pkey PRIMARY KEY (id)
);


-- technologies definition

-- Drop table

-- DROP TABLE technologies;

CREATE TABLE technologies (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT technologies_description_key UNIQUE (description),
	CONSTRAINT technologies_pkey PRIMARY KEY (id)
);


-- use_cases definition

-- Drop table

-- DROP TABLE use_cases;

CREATE TABLE use_cases (
	id serial4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT use_cases_description_key UNIQUE (description),
	CONSTRAINT use_cases_pkey PRIMARY KEY (id)
);


-- users definition

-- Drop table

-- DROP TABLE users;

CREATE TABLE users (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	company text NOT NULL,
	email text NOT NULL,
	"password" text NOT NULL,
	roles _text NOT NULL,
	enabled bool NULL DEFAULT false,
	"token" text NULL,
	datecreated timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	datelastlogin timestamp NULL,
	"comments" text NULL,
	tokenreset text NULL,
	approved bool NULL DEFAULT false,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- countries_in_countryregions definition

-- Drop table

-- DROP TABLE countries_in_countryregions;

CREATE TABLE countries_in_countryregions (
	country_id text NOT NULL,
	countryregions_id int4 NOT NULL,
	CONSTRAINT countries_in_countryregions_pkey PRIMARY KEY (country_id, countryregions_id),
	CONSTRAINT countries_in_countryregions_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
	CONSTRAINT countries_in_countryregions_countryregions_id_fkey FOREIGN KEY (countryregions_id) REFERENCES countryregions(id) ON DELETE CASCADE
);


-- regions definition

-- Drop table

-- DROP TABLE regions;

CREATE TABLE regions (
	id serial4 NOT NULL,
	country_id text NULL,
	description text NOT NULL,
	CONSTRAINT country_description_unique UNIQUE (country_id, description),
	CONSTRAINT regions_pkey PRIMARY KEY (id),
	CONSTRAINT regions_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);


-- sub_use_cases definition

-- Drop table

-- DROP TABLE sub_use_cases;

CREATE TABLE sub_use_cases (
	id serial4 NOT NULL,
	usecase_id int4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT sub_use_cases_pkey PRIMARY KEY (id),
	CONSTRAINT sub_use_cases_usecase_id_fkey FOREIGN KEY (usecase_id) REFERENCES use_cases(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);


-- organisations definition

-- Drop table

-- DROP TABLE organisations;

CREATE TABLE organisations (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	description text NULL,
	url text NULL,
	organisationtype_id int4 NOT NULL,
	founded int4 NULL,
	hqcountry_id text NOT NULL,
	hqregion_id int4 NOT NULL,
	business_growth_stage_id int4 NOT NULL,
	business_funding_stage_id int4 NOT NULL,
	datecreated timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	datemodified timestamp NULL,
	dateremoved timestamp NULL,
	"version" int4 NULL DEFAULT 0,
	owners _text NOT NULL,
	datemodifiedowner timestamp NULL,
	CONSTRAINT organisations_pkey PRIMARY KEY (id),
	CONSTRAINT organisations_business_funding_stage_id_fkey FOREIGN KEY (business_funding_stage_id) REFERENCES business_funding_stages(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT organisations_business_growth_stage_id_fkey FOREIGN KEY (business_growth_stage_id) REFERENCES business_growth_stages(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT organisations_hqcountry_id_fkey FOREIGN KEY (hqcountry_id) REFERENCES countries(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT organisations_hqregion_id_fkey FOREIGN KEY (hqregion_id) REFERENCES regions(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT organisations_organisationtype_id_fkey FOREIGN KEY (organisationtype_id) REFERENCES organisation_types(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);


-- solutions definition

-- Drop table

-- DROP TABLE solutions;

CREATE TABLE solutions (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	description text NOT NULL,
	url text NULL,
	organisation_id int4 NOT NULL,
	launch int4 NOT NULL,
	platform int4 NULL,
	bundling int4 NULL,
	primarysubusecase_id int4 NOT NULL,
	registeredusers int4 NULL,
	activeusers int4 NULL,
	shfusers int4 NULL,
	womenusers int4 NULL,
	youthusers int4 NULL,
	revenue int4 NULL,
	yieldlowerbound float4 NULL,
	yieldupperbound float4 NULL,
	incomelowerbound float4 NULL,
	incomeupperbound float4 NULL,
	datecreated timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	datemodified timestamp NULL,
	dateremoved timestamp NULL,
	"version" int4 NULL DEFAULT 0,
	visible bool NULL,
	owners _text NOT NULL,
	datemodifiedowner timestamp NULL,
	CONSTRAINT solutions_activeusers_check CHECK ((activeusers >= 0)),
	CONSTRAINT solutions_bundling_check CHECK (((bundling = 0) OR (bundling = 1))),
	CONSTRAINT solutions_check CHECK ((yieldupperbound >= yieldlowerbound)),
	CONSTRAINT solutions_check1 CHECK ((incomeupperbound >= incomelowerbound)),
	CONSTRAINT solutions_launch_check CHECK ((launch > 1899)),
	CONSTRAINT solutions_pkey PRIMARY KEY (id),
	CONSTRAINT solutions_platform_check CHECK (((platform = 0) OR (platform = 1))),
	CONSTRAINT solutions_registeredusers_check CHECK ((registeredusers >= 0)),
	CONSTRAINT solutions_revenue_check CHECK ((revenue >= 0)),
	CONSTRAINT solutions_shfusers_check CHECK ((shfusers >= 0)),
	CONSTRAINT solutions_womenusers_check CHECK ((womenusers >= 0)),
	CONSTRAINT solutions_youthusers_check CHECK ((youthusers >= 0)),
	CONSTRAINT solutions_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT solutions_primarysubusecase_id_fkey FOREIGN KEY (primarysubusecase_id) REFERENCES sub_use_cases(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);


-- sub_use_cases_in_solutions definition

-- Drop table

-- DROP TABLE sub_use_cases_in_solutions;

CREATE TABLE sub_use_cases_in_solutions (
	subusecase_id int4 NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT sub_use_cases_in_solutions_pkey PRIMARY KEY (subusecase_id, solution_id),
	CONSTRAINT sub_use_cases_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
	CONSTRAINT sub_use_cases_in_solutions_subusecase_id_fkey FOREIGN KEY (subusecase_id) REFERENCES sub_use_cases(id) ON DELETE CASCADE
);


-- tags_in_solutions definition

-- Drop table

-- DROP TABLE tags_in_solutions;

CREATE TABLE tags_in_solutions (
	tag_id int4 NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT tags_in_solutions_pkey PRIMARY KEY (tag_id, solution_id),
	CONSTRAINT tags_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
	CONSTRAINT tags_in_solutions_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);


-- technologies_in_solutions definition

-- Drop table

-- DROP TABLE technologies_in_solutions;

CREATE TABLE technologies_in_solutions (
	technology_id int4 NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT technologies_in_solutions_pkey PRIMARY KEY (technology_id, solution_id),
	CONSTRAINT technologies_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE,
	CONSTRAINT technologies_in_solutions_technology_id_fkey FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE
);


-- business_models_in_solutions definition

-- Drop table

-- DROP TABLE business_models_in_solutions;

CREATE TABLE business_models_in_solutions (
	businessmodel_id int4 NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT business_models_in_solutions_pkey PRIMARY KEY (businessmodel_id, solution_id),
	CONSTRAINT business_models_in_solutions_businessmodel_id_fkey FOREIGN KEY (businessmodel_id) REFERENCES business_models(id) ON DELETE CASCADE,
	CONSTRAINT business_models_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);


-- channels_in_solutions definition

-- Drop table

-- DROP TABLE channels_in_solutions;

CREATE TABLE channels_in_solutions (
	channel_id int4 NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT channels_in_solutions_pkey PRIMARY KEY (channel_id, solution_id),
	CONSTRAINT channels_in_solutions_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
	CONSTRAINT channels_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);


-- countries_in_solutions definition

-- Drop table

-- DROP TABLE countries_in_solutions;

CREATE TABLE countries_in_solutions (
	country_id text NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT countries_in_solutions_pkey PRIMARY KEY (country_id, solution_id),
	CONSTRAINT countries_in_solutions_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
	CONSTRAINT countries_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);


-- languages_in_solutions definition

-- Drop table

-- DROP TABLE languages_in_solutions;

CREATE TABLE languages_in_solutions (
	language_id int4 NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT languages_in_solutions_pkey PRIMARY KEY (language_id, solution_id),
	CONSTRAINT languages_in_solutions_language_id_fkey FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
	CONSTRAINT languages_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);


-- organisation_translations definition

-- Drop table

-- DROP TABLE organisation_translations;

CREATE TABLE organisation_translations (
	organisation_id int4 NOT NULL,
	language_id int4 NOT NULL,
	"translation" text NULL,
	CONSTRAINT organisation_translations_pkey PRIMARY KEY (organisation_id, language_id),
	CONSTRAINT organisation_translations_language_id_fkey FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
	CONSTRAINT organisation_translations_organisation_id_fkey FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
);


-- regions_in_solutions definition

-- Drop table

-- DROP TABLE regions_in_solutions;

CREATE TABLE regions_in_solutions (
	region_id int4 NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT regions_in_solutions_pkey PRIMARY KEY (region_id, solution_id),
	CONSTRAINT regions_in_solutions_region_id_fkey FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
	CONSTRAINT regions_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);


-- sectors_in_solutions definition

-- Drop table

-- DROP TABLE sectors_in_solutions;

CREATE TABLE sectors_in_solutions (
	sector_id int4 NOT NULL,
	solution_id int4 NOT NULL,
	CONSTRAINT sectors_in_solutions_pkey PRIMARY KEY (sector_id, solution_id),
	CONSTRAINT sectors_in_solutions_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT sectors_in_solutions_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- solution_translations definition

-- Drop table

-- DROP TABLE solution_translations;

CREATE TABLE solution_translations (
	solution_id int4 NOT NULL,
	language_id int4 NOT NULL,
	"translation" text NULL,
	CONSTRAINT solution_translations_pkey PRIMARY KEY (solution_id, language_id),
	CONSTRAINT solution_translations_language_id_fkey FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
	CONSTRAINT solution_translations_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES solutions(id) ON DELETE CASCADE
);
