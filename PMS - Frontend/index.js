
let allProducts = []


function getData() {

    fetch("http://localhost:3000/products", {
        method: "GET"
    })
        .then((response) => response.json())
        .then((products) => {

            allProducts = products;
            displayData(allProducts);

        })
        .catch((err) => {
            console.log(err);
        })

}

getData();


function displayData(products) {

    document.getElementById("products").innerHTML = "";

    products.forEach((product, index) => {

        let tr = document.createElement("tr")

        let noTD = document.createElement("td");
        noTD.append(index + 1);
        tr.appendChild(noTD);

        let nameTD = document.createElement("td");
        nameTD.append(product.name);
        tr.appendChild(nameTD);

        let priceTD = document.createElement("td");
        priceTD.append(product.price);
        tr.appendChild(priceTD);

        let quantityTD = document.createElement("td");
        quantityTD.append(product.quantity);
        tr.appendChild(quantityTD);

        let actionTD = document.createElement("td");

        let upICON = document.createElement("i");
        upICON.className = "icon fa-solid fa-file-pen text-success";
        upICON.setAttribute("data-bs-toggle","modal");
        upICON.setAttribute("data-bs-target","#exampleModal")

        upICON.addEventListener("click",function(){
            setUpdateModal(product.id);
        })

        let deICON = document.createElement("i");
        deICON.className = "icon fa-solid fa-trash text-danger";

        deICON.addEventListener("click", () => {
            deleteProduct(product.id);
        })

        actionTD.appendChild(upICON);
        actionTD.appendChild(deICON);

        tr.appendChild(actionTD)

        document.getElementById("products").appendChild(tr);
    })

}


function deleteProduct(id) {
    fetch("http://localhost:3000/products?id="+id, {
        method: "DELETE"
    })
        .then((response) => response.json())
        .then((msg) => {

            if(msg.success===true){
                let indexToDelete = allProducts.findIndex((product, index) => {
                    return Number(product.id) === Number(id);
                })
    
                allProducts.splice(indexToDelete, 1);
                displayData(allProducts);
                openToast(msg.message,true);
            }
            else{
                openToast(msg.message,false);
            }

            

        })
        .catch((err) => {
            console.log(err)
        })
}


function addData() {

    let product = {};
    product.id = document.getElementById("id").value;
    product.name = document.getElementById("name").value;
    product.price = Number(document.getElementById("price").value);
    product.quantity = Number(document.getElementById("quantity").value);

    fetch("http://localhost:3000/products", {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((msg) => {

            allProducts.push(product);
            displayData(allProducts);
            openToast(msg.message)


        })
        .catch((err) => {
            console.log(err);
        })

}


let idToUpdate=null
function setUpdateModal(id){
    let product=allProducts.find((product,index)=>{
        return Number(product.id)===Number(id);
    })

    idToUpdate=product.id;
    // console.log(product);

    document.getElementById('up_id').value=product.id;
    document.getElementById('up_name').value=product.name;
    document.getElementById('up_price').value=product.price;
    document.getElementById('up_quantity').value=product.quantity;


}

function updateProduct(){
    let product={};
    product.id = document.getElementById("up_id").value;
    product.name = document.getElementById("up_name").value;
    product.price = Number(document.getElementById("up_price").value);
    product.quantity = Number(document.getElementById("up_quantity").value);


    fetch("http://localhost:3000/products?id="+idToUpdate,{
        method:"PUT",
        body:JSON.stringify(product),
        headers:{
            "Content-Type":"application/json"
        }
    })  
    .then((response)=>response.json())
    .then((msg)=>{
         
        let productIndex=allProducts.findIndex((product,index)=>{
            return Number(product.id)===Number(idToUpdate)
        })

        allProducts[productIndex]=product;

        displayData(allProducts);
        openToast(msg.message);

    })
    .catch((err) => {
        console.log(err);
    })

}

function openToast(msg,success){

    document.getElementById("toast").innerText = msg;
    document.getElementById("toast").style.right = "0px";

    if(success===true){
        document.getElementById("toast").classList.add("success-msg");
        document.getElementById("toast").classList.remove("error-msg")  
    }
    else{
        document.getElementById("toast").classList.add("error-msg")
        document.getElementById("toast").classList.remove("success-msg");
    }


    setTimeout(() => {
        document.getElementById("toast").style.right = "-300px";
    }, 5000)

}