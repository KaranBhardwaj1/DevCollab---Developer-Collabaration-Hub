import { Link } from "react-router-dom";

const QuestionCard = ({ question }) => {
  return (
    <Link
      to={`/devconnect/questions/${question._id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg transition"
    >
      <h2 className="text-xl font-semibold">
        {question.title}
      </h2>

      <p className="mt-2 text-gray-600 line-clamp-2">
        {question.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {question.tags.map(tag=>(
          <span
            key={tag}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>👤 {question.author.name}</span>

        <span>
          👍 {question.votes}
        </span>

        <span>
          💬 {question.answersCount}
        </span>

        <span>
          👁 {question.views}
        </span>
      </div>
    </Link>
  );
};

export default QuestionCard;