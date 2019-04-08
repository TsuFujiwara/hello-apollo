const bacnet = require("@biancoroyal/bacstack");
const Encoding = require("encoding-japanese");

module.exports = objects = new Promise(resolve => {
  let thisAddress = "192.168.0.200";
  let broadcastAddress = "192.168.0.255";
  let targetAddress = "192.168.0.254";
  let pollingTime = 1;

  let objects = [];

  function reverseString(str) {
    return str
      .split("")
      .reverse()
      .join("");
  }

  const client = new bacnet({
    port: 47808, // Use BAC0 as communication port
    interface: thisAddress, // Listen on a specific interface
    broadcastAddress: broadcastAddress, // Use the subnet broadcast address
    adpuTimeout: 6000 // Wait twice as long for response
  });

  client.whoIs();
  // Discover Devices
  client.on("iAm", function(device) {
    console.log("targetAddress: ", device.address);
    console.log("deviceId: ", device.deviceId);
    console.log("maxApdu: ", device.maxApdu);
    console.log("segmentation: ", device.segmentation);
    console.log("vendorId: ", device.vendorId);
  });

  propertiesList = {
    "75": "objectId",
    "77": "objectName",
    "79": "ObjectType",
    "-1": "instanceNumber",
    "117": "units",
    "65-1": "maxPresValue",
    "69": "minPresValue",
    "72": "notifyType",
    "45": "highLimit",
    "59": "lowLimit",
    "46": "inactiveText",
    "4": "activeText",
    "84": "polarity",
    "43": "fileType",
    "42": "fileSize",
    "74": "numberOfStates",
    "110-1": "stateText1",
    "110-2": "stateText2",
    "110-3": "stateText3",
    "110-4": "stateText4",
    "110-5": "stateText5",
    "110-6": "stateText6",
    "110-7": "stateText7",
    "110-8": "stateText8",
    "110-9": "stateText9",
    "110-10": "stateText10",
    "17": "notificationClass",
    "132-1": "logDeviceObjectProperty1",
    "132-2": "logDeviceObjectProperty2",
    "132-3": "logDeviceObjectProperty3",
    "132-4": "logDeviceObjectProperty4",
    "134": "logInterval",
    "126": "bufferSize",
    "65-2": "maxPresValue2",
    "187": "Scale",
    "75-1": "objectIdentifier1",
    "75-2": "objectIdentifier2",
    "-2": "memo",
    "9003": "covMode",
    "9006": "covInterval",
    "35": "eventEnable",
    "52": "limitEnable",
    "22": "covIncrement",
    "113": "timeDelay",
    "": "FeedbackToPV",
    "9002": "intrinsicEventDisable",
    "168": "profileName",
    "85": "presentValue",
    "111": "statusFlags"
  };

  // ReadPropertyMultiple
  // 起動時1発
  var dt = new Date();
  dt.setMonth(dt.getMonth() + 1);
  client.timeSync(targetAddress, dt);

  var requestArray_all = [
    {
      objectId: { type: 3, instance: 0 },
      properties: [{ id: 8 }]
    },
    {
      objectId: { type: 4, instance: 0 },
      properties: [{ id: 8 }]
    },
    {
      objectId: { type: 5, instance: 0 },
      properties: [{ id: 8 }]
    }
  ];

  client.readPropertyMultiple(targetAddress, requestArray_all, (err, value) => {
    try {
      for (var i in value.values) {
        // i はオブジェクト個数
        let properties = {};
        for (var j in value.values[i].values) {
          // j はプロパティ個数
          let propertyName = propertiesList[value.values[i].values[j].id];
          let comVal = value.values[i].values[j].value[0].value;

          if (propertyName) {
            switch (propertyName) {
              case "eventEnable":
                properties[propertyName] = reverseString(
                  ("000" + Number(comVal.value).toString(2)).slice(-3)
                );
                break;
              case "statusFlags":
                properties[propertyName] = reverseString(
                  ("0000" + Number(comVal.value).toString(2)).slice(-4)
                );
                break;
              case "objectId":
                properties[propertyName] = parseInt(
                  ("0000000000" + Number(comVal.type).toString(2)).slice(-10) +
                    (
                      "0000000000000000000000" +
                      Number(comVal.instance).toString(2)
                    ).slice(-22),
                  2
                );
                properties["instanceNumber"] = comVal.instance;
                break;
              default:
                properties[propertyName] = comVal;
            }
          }
        }
        objects.push(properties);
      }
      // console.log(objects);
      resolve(objects);
    } catch (error) {
      console.error(error);
      console.log(
        "Smart-Saveに接続できませんでした。" +
          "クライアントIPアドレス：" +
          thisAddress +
          " Smart-SaveのIPアドレス:" +
          targetAddress +
          " にしてください。"
      );
    }
  });
});

// // 起動処理終了後;
// var requestArray = [
//   {
//     objectId: { type: 3, instance: 0 },
//     properties: [{ id: 77 }, { id: 85 }, { id: 111 }]
//   },
//   {
//     objectId: { type: 4, instance: 0 },
//     properties: [{ id: 77 }, { id: 85 }, { id: 111 }]
//   },
//   {
//     objectId: { type: 5, instance: 0 },
//     properties: [{ id: 77 }, { id: 85 }, { id: 111 }]
//   }
// ];

// var tmp = new Object();
// var sf = new Object();
// var sf_str = "";

// setInterval(() => {
//   client.readPropertyMultiple(targetAddress, requestArray, (err, value) => {
//     for (var i in value.values) {
//       tmp = value.values[i];
//       sf = tmp.values[2].value[0].value.value[0];
//       sf === 2 || sf === 3
//         ? (sf_str = String(sf) + "  unreliable !!")
//         : (sf_str = String(sf));
//       console.log(
//         `${tmp.values[0].value[0].value.substr(2)}  PV:${
//           tmp.values[1].value[0].value
//         }  SF:${sf_str}`
//       );
//     }
//     if (err) {
//       clearInterval();
//       console.log("clearInterval");
//     }
//   });
// }, pollingTime * 1000);

// WritePropertyMultiple
// const writeArray = [
//   {
//     objectId: { type: 1, instance: 0 },
//     values: [
//       {
//         property: { id: 85 },
//         value: [
//           {
//             type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
//             value: 20
//           }
//         ],
//         priority: 8
//       }
//     ]
//   },
//   {
//     objectId: { type: 1, instance: 0 },
//     values: [
//       {
//         property: { id: 85 },
//         value: [
//           {
//             type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
//             value: 20
//           }
//         ],
//         priority: 8
//       }
//     ]
//   }
// ];

// client.writePropertyMultiple(targetAddress, writeArray, (err, value) => {
//   console.log("value", value);
// });

// client.writeProperty(
//   targetAddress,
//   { type: 1, instance: 0 },
//   85,
//   [
//     {
//       type: bacnet.enum.ApplicationTags.BACNET_APPLICATION_TAG_REAL,
//       value: 100
//     }
//   ],
//   { priority: 8 },
//   function(err, value) {
//     console.log("value: ", value);
//   }
// );

// ReadPropertyMultiple
