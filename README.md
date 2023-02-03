
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>

# IAMMeter HomeBridge Plug-in

The aim of this plug-in is to make the HomeKit environment aware of when a household equiped with power generation (typically a solar system), is exporting power. This will allow the construction of automations which can take advantage of the excess power (e.g. running heating or cooling systems, hot water systems, and clothes dryers).

This plug-in is designed to interface with a Iammeter power meter. IAMMeter provide single and three phase power meters which are bi-directional (i.e. capable of measuring both forward / Grid and reverse/ export power). These devices are suited to monitoring power consumption and export for sites equiped with grid connected solar systems.

This project will initially focus on only the single phase meter.

## About

This project provides an output via a virtual light bulb which is configured to come on at a set export level (onThreashold) and turn off when the output drops to a set level (offThreshold). To avoid rapid on/off cycling of devices, the on thread hold should exceed the off thread hold by the usage of any automated devices. A large polling interval is also recommended (default 120 seconds) to further avoid cycling. 

This project has now achieved MVP for the single phase meter and is released for user evaluation. Feedback will be warmly welcomed.

## Install Development Dependencies

TBA

```
npm install
```


## Configuration

edit your Homebridge's config.json to include the following in the accessories section:

```json
"accessories": [
        {
            "accessory": "Meter",
            "name": "Meter",
            "ip": "192.168.1.177",
            "username": "admin",
            "password": "admin",
            "pollInterval": 120,
            "onThreashold": -1000,
            "offThreashold": 0
        }
]
```


### Core
| Key | Description | Default |
| --- | --- | --- |
| `accessory` | Must be `Meter` | N/A |
| `name` | Name to appear in the Home app | N/A |
| `ip` | The IP address of the Meter | N/A |

### Optional fields
| Key | Description | Default |
| --- | --- | --- |
| `username` | The username required to log in to the Meter | `admin` |
| `password` | The password required to log in to the meter | `admin` |
| `pollInterval` | Time (in seconds) between device polls | `120` |
| `onThreashold` | The power value at which the Meter output will turn on (generally negative)| `-2000`|
| `offThreashold` | The power value at which the Meter output will turn off | `0` |


## Output 

I am currently toying with several ideas in this space. Similar implimentations have used various parameters such as volume and brightness to act as a proxy for power which is currently unsupported in HomeKit. From a functional point of view, I expect the likely use case to be something like "when export power exceeds x, then turn on device Y". Thus I have implimented a simple virtual indicator (lamp) with a pre-defined "on" value as the most useful way to impliment the functionallity.


