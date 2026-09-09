import { useEffect,useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AnswerCard from "../components/AnswerCard";

const QuestionDetails=()=>{

const{id}=useParams();
const navigate=useNavigate();

const[question,setQuestion]=useState(null);

const[answers,setAnswers]=useState([]);

const[text,setText]=useState("");

const load=async()=>{

const q=await api.get(`/questions/${id}`);

const a=await api.get(`/answers/${id}`);

setQuestion(q.data);

setAnswers(a.data);

};

useEffect(()=>{

load();

},[]);

const submit=async()=>{

await api.post(`/answers/${id}`,{

answer:text,

code:"",

language:""

});

setText("");

load();

};

if(!question)return<div>Loading...</div>;

return(

<div className="max-w-5xl mx-auto p-6">

<h1 className="text-4xl font-bold">

{question.title}

</h1>

<p className="mt-5">

{question.description}

</p>

{question.code&&(

<pre className="bg-gray-900 text-green-300 p-5 rounded mt-5 overflow-auto">

{question.code}

</pre>

)}

<button

onClick={()=>navigate("/global-compiler")}

className="mt-5 bg-blue-600 text-white px-5 py-3 rounded"

>

💻 Open Public Compiler

</button>

<hr className="my-10"/>

<h2 className="text-3xl font-bold">

Answers

</h2>

<div className="space-y-5 mt-6">

{

answers.map(answer=>(

<AnswerCard

key={answer._id}

answer={answer}

/>

))

}

</div>

<div className="mt-10">

<h2 className="text-2xl font-bold">

Write Answer

</h2>

<textarea

rows={8}

value={text}

onChange={(e)=>setText(e.target.value)}

className="border rounded w-full p-4 mt-4"

/>

<button

onClick={submit}

className="bg-green-600 text-white px-5 py-3 rounded mt-4"

>

Submit Answer

</button>

</div>

</div>

);

};

export default QuestionDetails;