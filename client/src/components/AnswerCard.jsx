const AnswerCard = ({ answer }) => {

  return (

<div className="border rounded-xl p-5 bg-white">

<div className="flex justify-between">

<h2 className="font-semibold">

{answer.author.name}

</h2>

<div>

👍 {answer.votes}

</div>

</div>

<p className="mt-4 whitespace-pre-wrap">

{answer.answer}

</p>

{
answer.code && (

<pre className="mt-5 bg-gray-900 text-green-300 p-4 rounded overflow-auto">

{answer.code}

</pre>

)

}

</div>

);

};

export default AnswerCard;