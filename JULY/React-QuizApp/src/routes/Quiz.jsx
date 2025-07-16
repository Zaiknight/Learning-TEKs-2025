import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function pad(n) {
  return n.toString().padStart(2, "0");
}

export default function Quiz() {
  const quiz_list = JSON.parse(localStorage.getItem("quiz_list")) || [];
  const quizIndexRaw = sessionStorage.getItem("QuizIndex");
  const quizIndex = quizIndexRaw !== null ? JSON.parse(quizIndexRaw) : null;
  
  const [disabled,setDisabled] = useState(true);
  const [current, setCurrent] = useState(0); // Current question index
  const [answers, setAnswers] = useState({}); // {qIdx: userValue}
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  
  // If quizIndex is wrong, or quiz_list[quizIndex] is wrong go back to quiz list
  if (
    quizIndex === null ||
    quizIndex < 0 ||
    quizIndex >= quiz_list.length ||
    !quiz_list[quizIndex]
  ) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <div className="text-white text-2xl mb-6">Quiz not found.</div>
        <Link to="/quiz_form">
          <button className="px-8 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800">
            Back to Quiz List
          </button>
        </Link>
      </div>
    );
  }

  const quiz = quiz_list[quizIndex];
  const questions = quiz.questions || [];
  const q = questions[current];

  function handleOptionChange(e, optIdx) {
    setAnswers({
      ...answers,
      [current]: optIdx,
    });
    setDisabled(false);
  }
  function handleCheckboxChange(e, optIdx) {
    let prev = answers[current] || [];
    if (e.target.checked) {
      prev = [...prev, optIdx];
    } else {
      prev = prev.filter(i => i !== optIdx);
    }
    setAnswers({
      ...answers,
      [current]: prev,
    });
    setDisabled(false);
  }
  function handleShortAnswerChange(e) {
    setAnswers({
      ...answers,
      [current]: e.target.value,
    });
    setDisabled(false);
  }

  function goNext() {
    if (current < questions.length - 1) setCurrent(current + 1);
  }
  function goPrev() {
    if (current > 0) setCurrent(current - 1);
  }

  function submitQuiz() {
    let sc = 0;
    questions.forEach((ques, idx) => {
      if (ques.type === "Radio" && typeof ques.correctAnswerIndex === "number") {
        if (answers[idx] === ques.correctAnswerIndex) sc += 1;
      }
    });
    setScore(sc);
    setShowResult(true);
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="flex max-w-full h-full bg-gray-800 m-9 rounded-4xl">
        <h1 className="my-6 text-5xl font-semibold text-gray-200 ml-9">{quiz.text}</h1>
      </div>
      <div className="flex flex-col items-center max-w-full h-full bg-gray-800 m-9 rounded-4xl mt-5 p-10">
        {questions.length === 0 ? (
          <div className="text-gray-300 text-xl">No questions in this quiz.</div>
        ) : showResult ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-6">Quiz Submitted!</h2>
            <p className="text-xl text-gray-200 mb-2">
              Your score: <span className="font-semibold">{score}</span> out of <span className="font-semibold">{questions.filter(q => q.type === "Radio" && typeof q.correctAnswerIndex === "number").length}</span>
            </p>
            <button
              className="px-8 py-3 mt-6 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800"
              onClick={() => navigate('/quiz_form')}
            >
              Back to Quiz List
            </button>
          </div>
        ) : (
          <>
            <div className="w-full mb-8">
              <h2 className="text-2xl text-gray-100 mb-4">
                Question {(current + 1)} of {(questions.length)}
              </h2>
              <div className="text-xl text-gray-300 mb-4">{q.statement}</div>
              {q.type === "Radio" && (
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center text-gray-300">
                      <input
                        type="radio"
                        name={`radio-q${current}`}
                        checked={answers[current] === optIdx}
                        onChange={e =>{
                            handleOptionChange(e, optIdx);
                        }}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "Checkbox" && (
                <div className="flex flex-col gap-3">
                  {q.options.map((opt, optIdx) => (
                    <label key={optIdx} className="flex items-center text-gray-300">
                      <input
                        type="checkbox"
                        name={`checkbox-q${current}`}
                        checked={(answers[current] || []).includes(optIdx)}
                        onChange={e => {
                            handleCheckboxChange(e, optIdx);
                        }}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "Short Answer" && (
                <input
                  type="text"
                  className="w-full mt-4 px-4 py-2 border rounded bg-gray-700 text-gray-100"
                  placeholder="Your answer"
                  value={answers[current] || ""}
                  onChange={handleShortAnswerChange}
                />
              )}
            </div>
            <div className="flex justify-between w-full mt-4">
              <button
                className={`px-6 py-2 rounded-lg font-semibold ${current === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-900 text-white"}`}
                onClick={goPrev}
                disabled={current === 0}
              >
                Previous
              </button>
              <button
                className={`${disabled ? "bg-gray-500 px-6 py-2 rounded-lg font-semibold cursor-not-allowed" : `px-6 py-2 rounded-lg font-semibold ${current === questions.length - 1 ? "hidden" : "bg-indigo-700 hover:bg-indigo-900 text-white"}`}`}
                onClick={goNext}
                disabled={disabled}
              >
                Next
              </button>
              <button
                className={`px-6 py-2 rounded-lg font-semibold ${current === questions.length - 1 ? "bg-green-700 hover:bg-green-900 text-white" : "hidden"}`}
                onClick={submitQuiz}
                disabled={disabled}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
      {!showResult && (
        <div className="flex justify-center pb-10">
          <Link to="/quiz_form"><button
            className="px-8 py-3 mt-6 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800"
          >
            Back to Quiz List
          </button></Link>
        </div>
      )}
    </div>
  );
}