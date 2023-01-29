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
  username: any;
  password: any;
  

  constructor(log: Logging, config: AccessoryConfig, api: API) {                      // Class Constructor
    this.log = log;
    this.name = config.name;
    console.log('Name: ', this.name);
    this.ip = config.ip;
    console.log('IP address: ', this.ip);
    this.username = config.username || 'admin';
    console.log('Username: ', this.username);
    this.password = config.password || 'admin';
    console.log('Password: ', this.password);
    this.pollInterval = config.pollInterval || 120;
    console.log('Polling Interval: ', this.pollInterval);
    this.onThreashold = config.onThreashold || -2000;
    console.log('On Threashold: ', this.onThreashold);
    this.offThreashold = config.offThreashold || 0;
    console.log('Off Threashold: ', this.offThreashold);

    // Config error checking
    
    if (this.onThreashold > this.offThreashold){                          // Confirm on threashold is less than off threashold 
      console.log('ERROR - On Threashold > Off Threashold')
      // Should Stop Plug-in
    }
    // Check for mandatory fields



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
      this.meterGet(this.ip, this.username, this.password).then(
        (value) => {
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
    }, this.pollInterval * 1000);    

  }                                                                                      // End Class Constructor

  // Now define Class methods

  identify(): void {
    this.log("Identify!");
  }

  getServices(): Service[] {
    return [
      this.informationService,
      this.switchService,
    ];
  }

  async meterGet(ip_address: string, username: string, password: string){          // Method meterGet - Get JSON data from Meter
    const url = 'http://' + ip_address + '/monitorjson';
    const auth = username + ':' + password;
    console.log('Auth string: ', auth);
    const response = await fetch(url,
      {headers: {'Authorization': 'Basic ' + btoa(auth)}});
    const body = await response.json();

    return body;
  }

}
