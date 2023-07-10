import csvToJson from "csvtojson";

async function lastKnownLoc() {
    let df = await csvToJson().fromFile("Data.csv");
    //Getting list of unique id's
    let uniqueId=[]
    df.filter(item=>{
        uniqueId.push(item['uniqueid'])
    })
    console.log([...new Set(uniqueId)].length)
    uniqueId= [...new Set(uniqueId)]

    //Grouping up  
    let grpArr=[]
    for(let i=0;i<uniqueId.length;i++){
        grpArr.push(df.filter(item=>item['uniqueid']== uniqueId[i]))
    }

    let finObj=[]
    for(let i=0;i<grpArr.length;i++){
        for(let j=0;j<grpArr[i].length;j++){
            if(j==0){
                continue;
            } else if(grpArr[i][j]['lat'] == 0 && grpArr[i][j-1]['lat'] != 0){
                let temp={};
                temp['uniqueId']= grpArr[i][j]['uniqueid']
                temp['zero']= grpArr[i][j]
                temp['prev']= grpArr[i][j-1]
                finObj.push(temp)
            }
        }
    }

    console.log(finObj)
    
}

lastKnownLoc()