import csvToJson from "csvtojson"
async function maximumDistanceVehicle(){
    let myData = await csvToJson().fromFile("./Data.csv");
                           
    let uniqueVeh= [...new Set(myData.map(vehicles => vehicles.uniqueid))];   //Created a set to filter unique vehicles
  
    let result= [];

    for(let a=0;a<uniqueVeh.length;a++) {                                        //iterating through unique vehicles
        let arrVeh = myData.filter(item => item["uniqueid"]==uniqueVeh[a]);    //flitering all data of a particular vehicle 
        let distSum=0;
        for (let i=0; i< arrVeh.length-1; i++){                       //for to calculate the distance for each unique vehicle
            distSum += getHaversineDistance(arrVeh[i],arrVeh[i+1]);
        }

        let vehData = {
            uniqueID:uniqueVeh[a],
            totalNoOfPackets: arrVeh.length,
            startTime: arrVeh[0]["ts"],
            endTime: arrVeh[arrVeh.length - 1]["ts"],
            totalDistance: distSum
        }
        
        result.push(vehData);

    }

    console.log(result)

    let max = 0
    let maxID = -1
    for(let i=0; i<result.length; i++){
        if(result[i]["totalDistance"] > max){
            max = result[i]["totalDistance"]
            maxID = i
        }
    }

    console.log(`\n\nThe maximum distance a vehicle travelled is ${max}. The object corresponding to this vehicle is:`)
    console.log(result[maxID])

    function getHaversineDistance(coordinate1, coordinate2) {      // haversine to calculate distance by passing lat and lon
        var lon1 = coordinate1.lng;      
        var lat1 = coordinate1.lat;   
        var lon2 = coordinate2.lng;
        var lat2 = coordinate2.lat;
      
        var R = 6371; // km
        var x1 = lat2 - lat1;
        var dLat =  toRad(x1);
        var x2 = lon2 - lon1;
        var dLon =   toRad(x2);
      
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(  toRad(lat1)) 
        * Math.cos(  toRad(lat2)) *Math.sin(dLon / 2) *Math.sin(dLon / 2);
      
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }  
    function toRad(x) {
        return (x * Math.PI) / 180;      
    }
    
}
maximumDistanceVehicle();