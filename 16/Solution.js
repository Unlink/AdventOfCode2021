(async function() {
  var result = await fetch("https://adventofcode.com/2021/day/16/input");
  var raw = (await result.text()).trim();
  //raw = `9C0141080250320F1802104A08`;
  
	var bits = raw.split("").map(x => parseInt(x, 16).toString(2).padStart(4, "0")).join("").split("");
  console.log(bits);
  
  class Packet {
    constructor(version, typeID, data) {
      this.version = version;
      this.typeID = typeID;
      this.data = data;
    }
    
    calculatePacket() {
      switch (this.typeID) {
        case 0:
          return this.data.reduce((a, c) => a + c.calculatePacket(), 0);
        case 1:
          return this.data.reduce((a, c) => a * c.calculatePacket(), 1);
        case 2:
          return Math.min(...this.data.map(c => c.calculatePacket()));
        case 4: 
          return this.data;
        case 3:
          return Math.max(...this.data.map(c => c.calculatePacket()));
        case 5:
          return this.data[0].calculatePacket() > this.data[1].calculatePacket() ? 1 : 0;
        case 6:
          return this.data[0].calculatePacket() < this.data[1].calculatePacket() ? 1 : 0;
        case 7:
          return this.data[0].calculatePacket() == this.data[1].calculatePacket() ? 1 : 0;
      }
    }
    
  }
  
  class PacketBuilder {
    constructor(data) {
      this.version = -1;
      this.typeID = -1;
      this.data = data;
      this.packet = null;
      this.subParts = [];
      this.neededSubparts = 0;
      this.lengthType = -1;
    }
    
    buildPacket() {
      let etContent = this.typeID == 4 ? this.decodeLiteral(this.data) : this.subParts;
      this.packet = new Packet(this.version, this.typeID, etContent);
    }
    
    hasHeaderParsed() {
    	return this.typeID > -1
    } 
    
    isResolved() {
      return this.packet != null;
    }
    
    getPacket() {
      return this.packet;
    }
    
    addSubpart(packet) {
      this.subParts.push(packet);
      if (this.subParts.length == this.neededSubparts) {
        this.buildPacket();
      }
    }
      
    decodeLiteral(input) {
      let chnunk;
      let output = 0
      let strOutput = "";
      do {
        chnunk = input.splice(0, 5);
        output = (output * 16) + parseInt(chnunk.slice(1, 5).join(""), 2);
      } while (chnunk[0] == "1");
      return output;
    }
  }
    
 
  let packetStack = [new PacketBuilder(bits)];
  //Decoder loop
  while (packetStack.length > 1 || !packetStack[0].isResolved()) {
    let head = packetStack[packetStack.length - 1];
    let data = head.data;
    //console.log(packetStack.length, data.length, head);
    if (!head.hasHeaderParsed()) {
       head.version = parseInt(data.splice(0, 3).join(""), 2);
   		 head.typeID = parseInt(data.splice(0, 3).join(""), 2);
      if (head.typeID == 4) {
      	head.buildPacket();
      }
      else {
      	head.lengthType = parseInt(data.splice(0, 1));
      	if (head.lengthType == 0) {
          let len = parseInt(data.splice(0, 15).join(""), 2);
          head.data = data.splice(0, len);
          //console.log(head.data.length, data.length)
        }
        else {
          let len = parseInt(data.splice(0, 11).join(""), 2);
          head.neededSubparts = len;
        }
    	}
    }
    else if (head.isResolved()) {
      packetStack.pop();
      packetStack[packetStack.length - 1].addSubpart(head.getPacket())
    }
    //Has all data parsed in mode 
    else if (data.length < 7) { //Padding?
      head.buildPacket();
    }
    else {
      packetStack.push(new PacketBuilder(data));
    }
    
  }
  
  
  console.log(packetStack[0].getPacket());
  let sumVersions = ((p) => p.version + ((p.typeID == 4) ? 0 : p.data.reduce((a, c) => a + sumVersions(c), 0)));
  console.log(sumVersions(packetStack[0].getPacket()));
  console.log(packetStack[0].getPacket().calculatePacket())
})();