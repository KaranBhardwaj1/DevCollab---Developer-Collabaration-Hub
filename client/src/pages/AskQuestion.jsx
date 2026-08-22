import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AskQuestion=()=>{

const navigate=useNavigate();

const [title,setTitle]=useState("");

const [description,setDescription]=useState("");

const [language,setLanguage]=useState("");

const [tags,setTags]=useState("");

const [code,setCode]=useState("");

const submit=async(e)=>{

e.preventDefault();

await api.post("/questions",{

title,

description,

language,

code,

tags:tags.split(",")

});

navigate("/devconnect");

};

return(

<form

onSubmit={submit}

className="max-w-4xl mx-auto p-8 space-y-5"

>

<h1 className="text-3xl font-bold">

Ask Question

</h1>

<input

placeholder="Title"

value={title}

onChange={(e)=>setTitle(e.target.value)}

className="w-full border p-3 rounded"

/>

<textarea

rows={8}

placeholder="Description"

value={description}

onChange={(e)=>setDescription(e.target.value)}

className="w-full border p-3 rounded"

/>

<input

placeholder="Language"

value={language}

onChange={(e)=>setLanguage(e.target.value)}

className="w-full border p-3 rounded"

/>

<input

placeholder="Tags (comma separated)"

value={tags}

onChange={(e)=>setTags(e.target.value)}

className="w-full border p-3 rounded"

/>

<textarea

rows={10}

placeholder="Code"

value={code}

onChange={(e)=>setCode(e.target.value)}

className="w-full border p-3 rounded font-mono"

/>

<button

className="bg-blue-600 text-white px-6 py-3 rounded"

>

Post Question

</button>

</form>

);

};

export default AskQuestion;