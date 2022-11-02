import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const Upload = () => {
    const [data, setData] = useState([]);

    function readAppendFile(f) {
        // console.log(f);
        const reader = new FileReader();
        reader.onload = (evt) => {
            // evt = on_file_select event
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            /* Update state */
            // console.log("Data>>>" + data); // shows that excel data is read
            console.log(convertToJson(data));
            // setExtraUsers([...extrausers, ...convertToJson(data)]); // shows data in json format
            setData(convertToJson(data))
        };
        reader.readAsBinaryString(f);
    }
    const convertToJson = (csv) => {
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }
        return result;
    };

    const handleOnSubmit = async(e) => {
        e.preventDefault();
        const res = (await axios.post('/api/upload', { data })).data;
        console.log(res);
    };
    return (
        <div className="container my-5 d-flex justify-content-center">
            {/* form */}
            <form className="">
                <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => {
                        readAppendFile(e.target.files[0]);
                    }}
                    className=""
                />
                <button onClick={handleOnSubmit} className="btn btn-primary">
                    Upload
                </button>
            </form>
        </div>
    );
};

export default Upload;
