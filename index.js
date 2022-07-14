
const fs = require('fs');
const http = require('http');
const url = require('url');




http.createServer((req,res)=>{

    let parsedURL=url.parse(req.url,true)
    let products=fs.readFileSync("./products.json",{encoding:"utf-8"});

    res.writeHead(200,{
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods":"DELETE,POST,PUT",
        "Access-Control-Allow-Headers":"*"
    })

    if(req.method==="OPTION"){
        res.end();
    }
    // get request
    
    else if(req.method==="GET" && parsedURL.pathname==="/products"){
        
        let id = parsedURL.query.id;

    

        if(id===undefined){
            res.write(products)
        }
        
        else{
            let product=JSON.parse(products).find((ele,index)=>{
               return Number(ele.id)===Number(id);
            })

            if(product!==undefined){
                res.write(JSON.stringify(product));
            }
            else{
                res.write(JSON.stringify({message:"Invalid product ID",success:false}))
            }
        }
        res.end();

    }

    // delete request
    else if(req.method==="DELETE" && parsedURL.pathname==="/products"){

        let id = parsedURL.query.id;
        
        if(id!==undefined){
            let pro=JSON.parse(products);
            let index=pro.findIndex((element,index)=>{return Number(element.id)===Number(id)});
            pro.splice(index,1);

            fs.writeFile("./products.json",JSON.stringify(pro),(err)=>{
                if(err===null){
                    res.write(JSON.stringify({message:"product removed",success:true}))
                    res.end()
                }
            });
                
        }
        else{
            res.write(JSON.stringify({message:"Invalid product ID",success:false}))
            res.end();
        }
        

    }

    // post request
    else if(req.method==="POST" && parsedURL.pathname==="/products"){

        let data=""
        req.on("data",(chunk)=>{
            data+=chunk;
        })

        req.on("end",()=>{
            
            let dataOBJ=JSON.parse(data);
            let pro=JSON.parse(products);
            pro.push(dataOBJ);

            fs.writeFile("./products.json",JSON.stringify(pro),(err)=>{
                if(err===null){
                    res.write(JSON.stringify({message:"Product Added",success:true}))
                    res.end()
                }
            });
        })

      

    }

    // put request
    else if(req.method==="PUT" && parsedURL.pathname==="/products"){

        let id = parsedURL.query.id;

        let data=""
        req.on("data",(chunk)=>{
            data+=chunk;
        })

        req.on("end",()=>{

            
            let dataOBJ=JSON.parse(data);
            let pro=JSON.parse(products);

            let indexOfUpdate=pro.findIndex((product,index)=>{
                return Number(product.id)===Number(id);
            })

            pro[indexOfUpdate]=dataOBJ

            fs.writeFile("./products.json",JSON.stringify(pro),(err)=>{
                if(err===null){
                    res.write(JSON.stringify({message:"Product Updated",success:true}))
                    res.end()
                }
            });

        })

    }
    else{
        res.write(JSON.stringify({message:"Invalid request",success:false}))
        res.end()
    }

}).listen(8000,()=>{
    console.log("Server is up and running");
})
