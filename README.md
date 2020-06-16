# devices-iot-simulator

This sensor/actuator simulator was developed in Express and based on a [template](https://github.com/diogotorres97/express-template). It uses [Mosquitto](https://mosquitto.org/) as an MQTT broker and the solution is self-contained by using [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).


## Features

The devices' behavior is simulated by applying the publish-subscribe pattern. 

In the simulator, sensors operate as publishers by injecting readings. On the other hand, actuators serve as subscribers by receiving commands and, thus, updating their state. This tool does not simulate the interaction between sensors and actuators, i.e., the state of the actuators is not influenced by the sensor’s readings, but instead by the commands received. 

Aside from the capabilities of simulating devices, it is also possible to validate a given scenario. This mechanism is based on specific data that is sent through the sensors, causing a change of state in the actuators, which is checked to validate the scenario.

The main goal of the development of this simulator was to easily reproduce sensors and actuators to provide constant information in testing scenarios. This information is introduced through JSON files, leading to a generic simulator that creates all the logic needed at runtime. 

Note: All the information used to develop this simulator was based on the data collected by a physical IoT system providing a good approximation to a real scenario.

## Setup Project

### Cloning Project
```shell
$ git clone https://github.com/diogotorres97/devices-iot-simulator
$ cd devices-iot-simulator
```

### Run Containers

Inside the repository's main directory, run:

```shell
$ docker-compose up
```

You should now be able to access:
- http://localhost:3000 - REST API instance

## Routes Available

The more useful routes are described below and it is provided a [Postman collection](./Sensors-Fake-Server.postman_collection.json) with an example of each one.


| URL | Description | 
|:-|:-|
|/:scenario/load| Loads a given scenario|
|/:scenario/start/:messageFrequency?| Starts a given scenario with a given message frequency in milliseconds (optional)|
|/:scenario/reset| Resets a given scenario where the queues are emptied and the actuators' state restored|
|/:scenario/validate/:messageFrequency?| Starts a given scenario where the actuators are initialized with an initial state and after all the messages are sent (with a 5 seconds wait) the final state is checked |
|/:scenario/:actuator/status| Retrieves the actual state of an actuator to a given scenario|
|/:scenario/sensorsData| Retrieves all the messages loaded to a given scenario|
|/:scenario/actuators| Retrieves all the actuators available to a given scenario|


## Example data files

The data files are in `src/data` and follows the format:

### Sensor's data file
This file is composed of an array of messages. For each message, the `payload` is published in a queue with the `topic` associated. This topic name depends on the scenario name that follows the format `:scenarioName/:topic`.

```
[
  {
    "topic": "temp-hum-readings",
    "payload": {
      "node-id": "SENSOR-NODE-3-MOZIoT",
      "sensor": "dht11",
      "hum-percent": 36,
      "temp-C": 25,
      "dewpoint": 5.555468,
      "timestamp": 1585673987
    }
  },
  {
    "topic": "kitchen-motion-readings",
    "payload": {
      "node-id": "sensor-2",
      "sensor": "pir-motion",
      "motion-bool": 0,
      "timestamp": 1585673990
    }
  },
...
]

```

### Actuator file 
This file is composed of an array of actuators. For each actuator, the `defaultValue` is the initial state of the actuator every time that the scenario is (re)started. The topic represents the name of the queue where the actuator will receive commands. This topic name depends on the scenario name that follows the format `:scenarioName/:topic/command`.

```
[ 
  {
    "topic": "heat-system",
    "defaultValue": "OFF"
  },
  {
    "topic": "kitchen-lights",
    "defaultValue": "OFF"
  },
  {
    "topic": "coffee-machine",
    "defaultValue": "OFF"
  },
...
]
```


### Validation file
This file is composed of an array of actuators. For each actuator, the `topic` is equivalent to its name. Then, an `initialState` and a `finalState` are provided to check if, given a certain sensor's data, the actuators achieve that state.

```
[
  {
    "topic": "heat-system",
    "initialState": "OFF",
    "finalState": "ON"
  },
  {
    "topic": "kitchen-lights",
    "initialState": "OFF",
    "finalState": "ON"
  },
...
]
```

Each of these files is inside a folder related to its type (i.e., sensors-data, actuators, validation) that allows multiple files of each type to a given scenario. Since the simulator supports multiple scenarios, these folders are inside a folder with the given scenario name.