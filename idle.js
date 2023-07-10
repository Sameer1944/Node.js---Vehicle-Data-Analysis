//Finds most idle vehicle based on time or number of packets sent

import csvToJson from "csvtojson";
async function mostIdleVehicle() {
    let rows = await csvToJson().fromFile("./Data.csv");
    rows = rows.filter(item => item["lat"] != 0)                        //Remove objects with lat,long = 0,0
    


    let idList = [...new Set(rows.map(item => item["uniqueid"]))]       //Array with all the uniqueids (No duplicates)
    
    let dict = {}
    for(let i=0; i<idList.length; i++){                                                     //for every vehicle                    
        let vehicleData = rows.filter(item => item["uniqueid"]==idList[i])                  //filter out data specific to the vehicle id specified by idList[i]
        let count=0
        let time=0
        for(let j=0; j<vehicleData.length; j++){                                                                                //iterate through filtered vehicle data
            if((parseInt(vehicleData[j]["event_flag"])&1024==1024 && parseInt(vehicleData[j]["speed"])<=3)){                    //if vehicle is in IDLE state
                count++                                                                                                         //count number of packets sent
                //AND if next vehicle has 1024 and speed <=3, add the difference of their 'ts' to 'time' variable
                if(j!=vehicleData.length-1){
                    if((parseInt(vehicleData[j+1]["event_flag"])&1024==1024 && parseInt(vehicleData[j+1]["speed"])<=3)){            //if even in the next packet, sent by the same vehicle, the vehicle is in IDLE state
                        time += new Date(vehicleData[j+1]["ts"]).getTime()/1000 - new Date(vehicleData[j]["ts"]).getTime()/1000     //find the time difference between the two packets (in seconds)
                    }
                }
            }
        }
        dict[idList[i]] = [count,time]                                                  //Add the count and time (in a list) to an object as the value for vehicle's uniqueid as key
    }
    console.log(dict)


    let max_time=0;
    let maxid_time="";
    let max_packets=0;
    let maxid_packets="";

    for(let key in dict){                                           //find the vehicle withh highest IDLE duration and the duration
        if(dict[key][1]>max_time){
            max_time = dict[key][1]
            maxid_time = key
        }

        if(dict[key][0]>max_packets){                               //find the vehicle with highest number of IDLE packets sent and and the number of IDLE packets sent
            max_packets = dict[key][0]
            maxid_packets = key
        }

    }

    if(maxid_time == ''){
        maxid_time = 'NONE'
    }
    if(maxid_packets == ''){
        maxid_packets = 'NONE'
    }

    console.log("\n\nVehicle with maximum number of packets sent ("+max_packets+") while being IDLE: "+maxid_packets)
    console.log("\nVehicle with highest IDLE duration: "+maxid_time+" (for "+max_time+" seconds)\n\n")
}
   
mostIdleVehicle();
