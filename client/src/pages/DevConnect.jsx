import { useEffect, useState } from "react";
import api from "../services/api";

import SearchBar from "../components/SearchBar";
import QuestionCard from "../components/QuestionCard";
import { Link } from "react-router-dom";

const DevConnect = () => {

  const [questions,setQuestions]=useState([]);
  const [search,setSearch]=useState("");

  useEffect(()=>{

      const fetchQuestions=async()=>{

          const res=await api.get("/questions");

          setQuestions(res.data);

      };

      fetchQuestions();

  },[]);

  const filteredQuestions=questions.filter((q)=>
      q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (

<div className="max-w-6xl mx-auto p-6">

<div className="flex justify-between items-center mb-6">

<h1 className="text-4xl font-bold">

DevConnect

</h1>

<Link
to="/devconnect/ask"
className="bg-blue-600 text-white px-5 py-3 rounded-lg"
>

+ Ask Question

</Link>

</div>

<SearchBar
search={search}
setSearch={setSearch}
/>

<div className="mt-8 space-y-5">

{
filteredQuestions.map(question=>(

<QuestionCard

key={question._id}

question={question}

/>

))
}

</div>

</div>

  );

};

export default DevConnect;