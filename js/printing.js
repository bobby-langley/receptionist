//-- LOGS COMPONENT DATA
var _LOGS_LIST = null,
    _LOGS_CONT = null,
    _LOG_COUNT = 0;

//-- PRINTER API DATA
var PRINT_PORT = {
    PRINT_PORT_0: "PRINTERPORT0",
    PRINT_PORT_1: "PRINTERPORT1",
    PRINT_PORT_2: "PRINTERPORT2"
};

var BAUDRATE = 115200; //9600

var PARITY = {
    PARITY_NONE: "NONE",
    PAIRTY_ODD: "ODD",
    PARITY_EVEN: "EVEN"
};

var STOP_BITS = {
    STOP_BITS_ONE: "1",
    STOP_BITS_ONE_POINT_FIVE: "1.5",
    STOP_BITS_TWO: "2"
};

var DATA_BITS = {
    DATA_BITS_5: "BITS5",
    DATA_BITS_6: "BITS6",
    DATA_BITS_7: "BITS7",
    DATA_BITS_8: "BITS8"
};

var printerService = {
    getSerialPrintVersion: function () {
        var Version = null;
        try {
            Version = window.b2bapis.serialprint.getVersion();
        } catch (e) {
            console.log("[SerialPrint API][getVersion] call syncFunction exception [" + e.code + "] name: " + e.name + " message: " + e.message);
        }
        if (null !== Version) {
            console.log("[SerialPrint API][getVersion] call syncFunction type: " + Version);
        }
    },

    openSerialPrint: function () {
        console.log("[SerialPrint API][open] function call");
        var option = null;
        var result = false;
        option = {
            baudRate: BAUDRATE,
            parity: PARITY.PARITY_NONE,
            dataBits: DATA_BITS.DATA_BITS_8,
            stopBits: STOP_BITS.STOP_BITS_ONE,
        };
        var printPort = PRINT_PORT.PRINT_PORT_1;

        function onlistener(printSerialData) {
            console.log("[SerialPrint API] Print serial data is " + printSerialData.data + ", Print serial Port is === " + printSerialData.result);
        }
        try {
            result = window.b2bapis.serialprint.open(printPort, option, onlistener);
            if (result == true) {
                console.log("[SerialPrint API]Success to open print serial port");
            } else {
                console.log("[SerialPrint API]Fail to open print serial port" + result);
            }
        } catch (e) {
            console.log("[SerialPrint API][open] call syncFunction exception " + e.code + " " + e.errorName + " " + e.errorMessage);
        }
    },

    closeSerialPrint: function () {
        console.log("[SerialPrint API][close] function call");
        var result = false;
        var printPort = PRINT_PORT.PRINT_PORT_1;

        try {
            result = window.b2bapis.serialprint.close(printPort);
            if (result == false) {
                console.log("[SerialPrint API]Fail to close print serial port");
            }
        } catch (e) {
            console.log("[SerialPrint API][close] call syncFunction exception " + e.code + " " + e.errorName + " " + e.errorMessage);
        }
    },

    writeReceipt: function () {
        console.log("writeReceipt")
        console.log("[SerialPrint API][write] function call");
        var result = false;
        var printPort = PRINT_PORT.PRINT_PORT_1;
        var receiptData = printerService.generateReceiptData()
        var data = printerService.stringToHex(receiptData);
        try {
            result = window.b2bapis.serialprint.writeData(printPort, data, data.length);
            console.log("[SerialPrint API][writeData_0] writeData size is " + result);
        } catch (e) {
            console.log("[SerialPrint API][writeData] call syncFunction exception " + e.code + " " + e.errorName + " " + e.errorMessage);
        }
    },

    generateReceiptData: function () {
        var receiptData =
            "<l>ALIGNMENT LEFT </><e>"+
            "<c>ALIGNMENT CENTER </><e>" +
            "<r>ALIGNMENT RIGHT </><e>" +
            "<b>BOLD TEXT </><e>" +
            "<u>UNDERLINED TEXT </><e>"+
            "<1>TEXT1</><e>"+
            "<2>TEXT2</><e>"+
            "<3>TEXT3</><e>"+
            "<4>TEXT4</><e>"+
            "<5>TEXT5</><e>"+
            "<6>TEXT6</><e>"+
            "<7>TEXT7</><e>"
        return receiptData
    },

    stringToHex: function (tmp) {
        var str = '';
        var tmp_len = tmp.length;
        var c;
        var tag;

        for (var i = 0; i < tmp_len; i++) {
            if (tmp[i] === "<") {
                tag = true;
            } else if (tmp[i] === ">") {
                tag = false;
            } else {
                if (tag) {
                    switch (tmp[i]) {
                        // --Text Align Left
                        case "l":
                            c = "1B6100"
                            break;
                        // --Text Align Center
                        case "c":
                            c = "1B6101";
                            break;
                        // --Text Align Right
                        case "r":
                            c = "1B6102";
                            break;
                        // --Underline Text
                        case "u":
                            c = "1B2D01";
                            break;
                        // --Bold Text
                        case "b":
                            c = "1B4701";
                            break;
                        // --Text Size 1
                        case "1":
                            //width/height
                            var size = "00"
                            c = "1D21" + size;
                            break;
                        // --Text Size 2
                        case "2":
                            var size = "11"
                            c = "1D21" + size;
                        // --Text Size 3
                        case "3":
                            var size = "22"
                            c = "1D21" + size;
                            break;
                        // --Text Size 4
                        case "4":
                            var size = "33"
                            c = "1D21" + size;
                            break;
                        // --Text Size 5
                        case "5":
                            var size = "44"
                            c = "1D21" + size;
                            break;
                        // --Text Size 6
                        case "6":
                            var size = "55"
                            c = "1D21" + size;
                            break;
                        // --Text Size 7
                        case "7":
                            var size = "66"
                            c = "1D21" + size;
                            break;
                        // --Enter
                        case "e":
                            c = "0A";
                            break;
                        // --Set Default Values
                        case "/":
                            c = "1B61001B2D001B47001D2100";
                            break;
                        default:
                            break;
                    }
                } else {
                    c = (tmp.charCodeAt(i)).toString(16);
                }

                str += c.toString(16);
            }


            if (i == tmp_len - 1) str += "0A0A0A0A1B69";
        }
        return str;
    },
}