import csvToJson from "csvtojson";
async function find() {
  let m = await csvToJson().fromFile("./Data.csv");

  const id=m.map(i=>i.uniqueid.slice(0,-1))
  const speeds=m.map(i=>Number(i.speed))
//   console.log(speeds)
  //const eve=m.map(i=>i.event_flag) 
  const b = {};
  const sum = {};

  id.forEach((uniqueid, index) => {
    //if(eve[index]&1024==1024){    /*Checking for only running vehicles*/
    if (!b[uniqueid]) {
      b[uniqueid] = 1;
      sum[uniqueid] = speeds[index];
    } else {
      b[uniqueid] += 1;
      sum[uniqueid] += speeds[index];
    }
  //}
  });
  const averageSpeeds = {};
  for (const uniqueid in b)
   {
    averageSpeeds[uniqueid] = sum[uniqueid] / b[uniqueid];
   }
 // console.log("Average speeds:", averageSpeeds);

 const results = [];
 for (const uniqueid in averageSpeeds) {
   const output = {
    uniqueID: uniqueid,
     averageSpeed: averageSpeeds[uniqueid],
     totalNoOfPackets: b[uniqueid]
   };
   results.push(output);
 }
 console.log(results);
}
find()
