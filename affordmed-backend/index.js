const express=require('express');
const cors=require('cors');
const {v4:uuidv4}=require('uuid');
const mockProducts=require('./mockData.js');

const app=express();
app.use(cors());

const PORT=8000;

let productCache=[];

const FAKE_BEARER_TOKEN = "THIS_IS_A_FAKE_BUT_VALID_LOOKING_TOKEN_STRING";

app.get('/categories/:categoryId/products',async(req,res)=>{
    const {categoryId}=req.params;
    const {top,page=1,sortBy,sortOrder='asc',minPrice,maxPrice}=req.query;

    if(!top || !minPrice || !maxPrice){
        return res.status(400).json({error:"Missing required parameters"});
    }

    const companies=['ANZ','FLP','SNP','MYP','AZO'];
    const options={
        method:"GET",
        headers:{'Authorization':`Bearer ${FAKE_BEARER_TOKEN}`}
    };

    try{
      const fetchPromises=companies.map(company=> fetch(`http://20.244.56.144/test/companies/${company}/categories/${categoryId}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`, options))
      const responses=await Promise.allSettled(fetchPromises);
      let allProducts=[];
      for(const response of responses){
        if(response.status==="fulfilled" && response.value.ok){
            const products=await response.value.json();
            if(Array.isArray(products)){
                allProducts.push(...products);
            } 
        }
      }
      if(sortBy){
        allProducts.sort((a,b)=>{
            if(sortOrder==='desc'){
                return b[sortBy]-a[sortBy];
            }
            return a[sortBy]-b[sortBy];
        })
      }

      const ProductWithIds=allProducts.map((p)=>({
        ...p,
        id:uuidv4()
      }))

      productCache=[...ProductWithIds];

      const n=parseInt(top);
      if(n<=10){
        const finalProducts=productCache.slice(0,n);
        return res.json(finalProducts);
      }
      else{
        const limit=10;
        const startIndex=(page-1)*limit;
        const endIndex=startIndex+limit;
        const finalProducts=productCache.slice(startIndex,endIndex);
        return res.json(finalProducts);
      }
    } catch(error){
        console.error("Error in fetching products:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
    
})

app.get('/categories/:categoryId/products/:productId',(req,res)=>{
    const{productId}=req.params
    const product=productCache.find((p)=>p.id===productId);
    if(product){
        res.json(product);
    }
    else{
        res.status(404).json({message:"Product not found"});
    }
})

app.listen(8000,()=>{
    console.log("server is running at port 8000");
})