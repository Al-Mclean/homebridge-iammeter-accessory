import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service
} from 'homebridge';
import fetch from 'node-fetch';


let hap: HAP;

export = (api: API) => {
  hap = api.hap;
  api.registerAccessory("Meter", Meter);
};

class Meter implements AccessoryPlugin {                                                // Define Class

  private readonly log: Logging;
  private readonly name: string;
  private switchOn = false;

  private readonly switchService: Service;
  private readonly informationService: Service;
  ip: any;
  pollInterval: any;
  onThreashold: any;
  offThreashold: any;
  

  constructor(log: Logging, config: AccessoryConfig, api: API) {                      // Class Constructor
    this.log = log;
    this.name = config.name;
    console.log('Name: ', this.name);
    this.ip = config.ip;
    console.log('IP address: ', this.ip);
    this.pollInterval = config.pollInterval;
    console.log('Polling Interval: ', this.pollInterval);
    this.onThreashold = config.onThreashold;
    console.log('On Threashold: ', this.onThreashold);
    this.offThreashold = config.offThreashold;
    console.log('Off Threashold: ', this.offThreashold);
    
    
    this.switchService = new hap.Service.Switch(this.name);

    this.switchService.getCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Current state of the switch was returned: " + (this.switchOn? "ON": "OFF"));
        callback(undefined, this.switchOn);
      })
      .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        this.switchOn = value as boolean;
        log.info("Switch state was set to: " + (this.switchOn? "ON": "OFF"));
        callback();
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "Custom Manufacturer")
      .setCharacteristic(hap.Characteristic.Model, "Custom Model");

    log.info("Switch finished initializing!");

      
    setInterval(() => {
      console.log('Request Energy Meter Data');
      this.meterGet().then(
        (value) => {
          //console.log('Result: ', value);
          console.log('');
          console.log('Accessory Voltage:', value.Data[0]);
          console.log('Current:', value.Data[1]);
          console.log('Active Power:', value.Data[2]);
          console.log('Import Power:', value.Data[3]);
          console.log('Export Power:', value.Data[4]);
          console.log('IP address: ', this.ip);
          if(value.Data[2] < this.onThreashold){
            this.switchOn = true;
            console.log('Meter reading is less than ', this.onThreashold, ' - switch on');
          }
          if(value.Data[2] > this.offThreashold){
              this.switchOn = false;
              console.log('Meter reading is greater than ', this.offThreashold, '- switch off');
          }

        },
        (error) => {
          console.log('Error: ', error);
        },
      );
    }, this.pollInterval);    

  }                                                                                      // End Class Constructor

  // Now define Class methods

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */


  identify(): void {
    this.log("Identify!");
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [
      this.informationService,
      this.switchService,
    ];
  }

  async meterGet(){                                                   // Method meterGet - Get JSON data from Meter
    // const url = 'http://192.168.1.123/monitorjson';
    const response = await fetch('http://192.168.1.123/monitorjson',
      {headers: {'Authorization': 'Basic ' + btoa('admin:admin')}});
    const body = await response.json();

    return body;
  }

}
