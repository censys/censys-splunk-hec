# censys-splunk-hec

Ingest Censys data into a Splunk instance via its HTTP Event Collector (HEC).


## Overview

censys-splunk-hec is a docker container that pulls data from the Censys Enterprise Platform, performs any needed data enrichments, and pushes the data to a Splunk instance's HTTP Event Collector (HEC) in JSON format.


## Dependencies

Docker


## Setup Summary

Step 1: Configure an HTTP Event Collector in Splunk

Step 2: Clone the censys-splunk-hec repository

Step 3: Copy settings_example.yaml to settings.yaml and modify settings.yaml:

 - A Censys API key is needed and can be found here: https://app.censys.io/admin
 - Splunk HEC settings begin with SPLUNK_ and should match the settings in the Splunk HEC configuration

Step 4: Build a container for the Censys Splunk HEC Integration:

 - ./censys-splunk-hec.sh build

 To store persistent files, a directory is created (if necessary) and mounted on the docker host: "$HOME/censys/storage/splunk-hec"

 Step 5: Run the container:

 - ./censys-splunk-hec.sh run


## Setup Details

See the docs folder for setup details.