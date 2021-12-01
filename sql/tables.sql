CREATE TABLE animals (
  id serial primary key,
  name text not null
);

CREATE TABLE dog_steps (
  id serial primary key,
  instruction text not null
);

CREATE TABLE fish_steps (
  id serial primary key,
  instruction text not null
);

CREATE TABLE fox_steps (
  id serial primary key,
  instruction text not null
);