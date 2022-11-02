const express = require('express');
const { DB } = require('./utils');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();

app.use(express.json())

app.use(cors())

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"))
    const path = require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
    })
}

// app.get('/', async(req, res) => {
//     try {
//         return res.status(201).json({ message: 'Hello!',name:"Divyanshu Kaushik", job:"Full Stack Developer" });
//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server Error", error });
//     }
// });

app.get('/api/search/:id', async(req, res) => {
    try {
        const data = await DB.get('mak_trading',`item#${req.params.id}`);
        return res.status(200).json({ message: 'Successfully fetched data', data });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.get('/api/search', async(req, res) => {
    try {
        let data;
        if(req.query.id){
            data = await DB.queryBeginsWith('mak_trading',`item#${req.query.id}`);
        }else{
            data = await DB.queryBeginsWith('mak_trading','item#');
        }
        return res.status(200).json({ message: 'Successfully fetched data', data });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.post('/api/upload', async(req, res) => {
    try {
        const {data} = req.body;
        const batches = await data.map((item) => {
            return {
                pk: 'mak_trading',
                sk: `item#${item.id}`,
                ...item
            }
        });
        console.log(batches);
        await DB.batchInsert(batches);
        return res.status(201).json({ message: 'Data added Successfully'});
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port 4000');
    }
);