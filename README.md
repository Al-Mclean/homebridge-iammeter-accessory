
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>


# IAMMeter HomeBridge Plug-in

IAMMeter provide single and three phase power meters which are bi-directional (i.e. capable of measuring both forward / Grid and reverse/ export power). These devices are suited to monitoring power consumption and export for sites equiped with grid connected solar systems.

This project will initially focus on only the single phase meter.

## About

Work in Progress

## Install Development Dependencies

TBA

```
npm install
```


## Configuration

edit your Homebridge's config.json to include the following in the accessories section:

        {
            "platform": "IAMMeter",
            "name": "IAMMeter Power Meter",
            "meters": [
                {
                    "name": "Meter 1",
                    "ip": "129.127.1.177"
                }
            ]
        }

* "name"              			The Homekit Accessory Name.


## Output 

I am currently toying with several ideas in this space. Similar implimentations have used various parameters such as volume and brightness to act as a proxy for power which is currently unsupported in HomeKit. From a functional point of view, I expect the likely use case to be something like "when export power exceeds x, then turn on device Y". Thus some simple virtual indicator (lamp etc) with a pre-defined "on" value may be the most useful way to impliment the functionallity.


