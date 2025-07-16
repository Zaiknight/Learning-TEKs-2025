import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/MainComponent.jsx";
import Modal from "../components/Modal.jsx";
import { Navigate, Link, NavLink } from "react-router-dom";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  } catch {
    return dateString;
  }
}

export default function QuizForm() {
  const [quizList, setQuizList] = useState(() => {
    return JSON.parse(localStorage.getItem("quiz_list")) || [];
  });

  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [open,setOpen] = useState(false);

  // Add Question state
  const [addQues, setAddQues] = useState(false);
  const [addType, setAddType] = useState(false);
  const [questionStatement, setQuestionStatement] = useState('');
  const [answerIndex, setAnswerIndex] = useState(null);
  const [questionType, setQuestionType] = useState('');
  const [optionInputs, setOptionInputs] = useState([""]);
  const [addingToQuizIdx, setAddingToQuizIdx] = useState(null);

  // Question List/Preview toggling
  const [previewOpenIdx, setPreviewOpenIdx] = useState(null);

  // Editing a question
  const [editingQuestion, setEditingQuestion] = useState({quizIdx: null, qIdx: null});
  const [editQuestionValue, setEditQuestionValue] = useState("");
  const [editQuestionOptions, setEditQuestionOptions] = useState([]);

  useEffect(() => {
    localStorage.setItem("quiz_list", JSON.stringify(quizList));
  }, [quizList]);

  function addQuiz(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setQuizList([
      ...quizList,
      {
        text: input.trim(),
        createdAt: new Date().toISOString(),
        questions: [],
      }
    ]);
    setInput("");
  }

  function deleteQuiz(idx) {
    const updated = [...quizList];
    updated.splice(idx, 1);
    setQuizList(updated);
    if (previewOpenIdx === idx) setPreviewOpenIdx(null);
    setOpen(false);
  }

  function deleteQuestion(idx,qidx) {
    const updated = [...quizList];
    updated[idx].questions.splice(qidx, 1);
    setQuizList(updated);
    if (previewOpenIdx === idx) setPreviewOpenIdx(null);
  }


  function startEdit(idx) {
    setEditingIndex(idx);
    setEditValue(quizList[idx].text);
  }

  function submitEdit(idx) {
    if (!editValue.trim()) return;
    const updated = [...quizList];
    updated[idx].text = editValue.trim();
    setQuizList(updated);
    setEditingIndex(null);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditValue("");
  }

  function handleClick(idx) {
    setAddQues(true);
    setAddingToQuizIdx(idx);
    setAddType(false);
    setQuestionType('');
    setQuestionStatement('');
    setOptionInputs([""]);
  }

  function submitType() {
    setAddType(true);
    setOptionInputs([""]);
  }

  function handleOptionChange(idx, value) {
    setOptionInputs(opts => opts.map((opt, i) => (i === idx ? value : opt)));
  }

  function addOptionInput() {
    setOptionInputs(opts => [...opts, ""]);
  }

  function removeOptionInput(idx) {
    setOptionInputs(opts => opts.filter((_, i) => i !== idx));
  }
  
  function submitAnswerRadio(oidx) {
    setAnswerIndex(oidx);
  }

  function cancelAddQuestion() {
    setAddQues(false);
    setAddType(false);
    setAddingToQuizIdx(null);
    setQuestionStatement('');
    setQuestionType('');
    setOptionInputs([""]);
  }

  function addQuestion(e) {
    e.preventDefault();
    if (!questionStatement.trim() || !questionType) return;
    const newQuestion = {
      statement: questionStatement.trim(),
      type: questionType,
      options: (questionType === "Checkbox" || questionType === "Radio")
        ? optionInputs.filter(opt => opt.trim())
        : [],
        correctAnswerIndex : questionType === "Radio" ? answerIndex : null,
    };
    const updated = [...quizList];
    updated[addingToQuizIdx].questions = updated[addingToQuizIdx].questions
      ? [...updated[addingToQuizIdx].questions, newQuestion]
      : [newQuestion];
    setQuizList(updated);
    cancelAddQuestion();
  }

  function togglePreview(idx) {
    setPreviewOpenIdx(idx === previewOpenIdx ? null : idx);
    setEditingQuestion({quizIdx: null, qIdx: null});
  }

  // Question editing logic
  function startEditQuestion(quizIdx, qIdx) {
    setEditingQuestion({quizIdx, qIdx});
    setEditQuestionValue(quizList[quizIdx].questions[qIdx].statement);
    setEditQuestionOptions(
      quizList[quizIdx].questions[qIdx].options
        ? [...quizList[quizIdx].questions[qIdx].options]
        : []
    );
  }
  function cancelEditQuestion() {
    setEditingQuestion({quizIdx: null, qIdx: null});
    setEditQuestionValue("");
    setEditQuestionOptions([]);
  }
  function submitEditQuestion(quizIdx, qIdx) {
    if (!editQuestionValue.trim()) return;
    const updated = [...quizList];
    updated[quizIdx].questions[qIdx].statement = editQuestionValue.trim();
    if (updated[quizIdx].questions[qIdx].options) {
      updated[quizIdx].questions[qIdx].options = editQuestionOptions;
    }
    setQuizList(updated);
    cancelEditQuestion();
  }
  function handleEditOptionChange(optIdx, value) {
    setEditQuestionOptions(opts => opts.map((opt, i) => (i === optIdx ? value : opt)));
  }
  function addEditOptionInput() {
    setEditQuestionOptions(opts => [...opts, ""]);
  }
  function removeEditOptionInput(optIdx) {
    setEditQuestionOptions(opts => opts.filter((_, i) => i !== optIdx));
  }

  // Move question up/down
  function moveQuestion(quizIdx, qIdx, dir) {
    const updated = [...quizList];
    const arr = updated[quizIdx].questions;
    if ((dir === -1 && qIdx === 0) || (dir === 1 && qIdx === arr.length - 1)) return;
    [arr[qIdx], arr[qIdx + dir]] = [arr[qIdx + dir], arr[qIdx]];
    updated[quizIdx].questions = arr;
    setQuizList(updated);
    if (editingQuestion.quizIdx === quizIdx) {
      setEditingQuestion({
        quizIdx,
        qIdx: qIdx + dir === editingQuestion.qIdx ? editingQuestion.qIdx : (qIdx + dir)
      });
    }
  }

  function isCorrectAnswer(idx) {
    return answerIndex === idx;
  }
  
  

  return (
    <SidebarLayout>
      <main className="h-full pb-16 overflow-y-auto">
        <div className="container grid px-6 mx-auto">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Quiz Form
          </h2>
          <form className="flex mb-6">
            <input
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Add a new Quiz"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded-r-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onClick={addQuiz}
            >
              Add
            </button>
          </form>
          <div className="w-full overflow-hidden rounded-lg shadow-xs bg-white dark:bg-gray-800">
            <table className="w-full whitespace-no-wrap">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-center">Quiz</th>
                  <th className="px-4 py-3 text-center">Created At</th>
                  <th className="px-4 py-3 text-center">Questions</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {quizList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                      No Quizzes yet.
                    </td>
                  </tr>
                ) : (
                  quizList.map((quiz, idx) => (
                    <React.Fragment key={idx}>
                      <tr className="text-gray-700 dark:text-gray-200 text-center">
                        <td className="px-4 py-3">
                          {editingIndex === idx ? (
                            <form
                              onSubmit={e => {
                                e.preventDefault();
                                submitEdit(idx);
                              }}
                              className="flex"
                            >
                              <input
                                className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:text-gray-100"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === "Enter") submitEdit(idx);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                autoFocus
                              />
                              <button
                                className="ml-2 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                type="submit"
                              >
                                Save
                              </button>
                              <button
                                className="ml-2 px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                type="button"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            quiz.text
                          )}
                        </td>
                        <td className="px-4 py-3">{formatDate(quiz.createdAt)}</td>
                        <td className="px-4 py-3">
                          {quiz.questions && quiz.questions.length > 0 ? quiz.questions.length : 0}
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <button
                            className="px-2 py-1 h-10 w-35 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => startEdit(idx)}
                            disabled={editingIndex === idx}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 h-10 w-35 mb-3 bg-red-500 text-white rounded hover:bg-red-800"
                            onClick={() => setOpen(true)}
                          >
                            Delete
                          </button>
                          <Modal open={open} onClose={() => setOpen(false)}>
                                <div className="mx-auto my-4 w-48">
                                  <svg className="w-6 h-6 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                  </svg>
                                  <div className="mx-auto my-4 w-48">
                                    <h3 className="text-lg text-gray-50 font-semibold text-center">Confirm Delete</h3>
                                    <p className="text-sm text-gray-400 text-center">
                                      Are you sure you want to delete this Quiz?
                                    </p>
                                  </div>
                                  <div className="flex gap-4">
                                      <button className="btn btn-danger w-full bg-red-600 rounded-lg text-white p-2 hover:bg-red-700" onClick={() => deleteQuiz(idx)}>Delete</button>
                                      <button className="btn btn-light w-full bg-gray-500 rounded-lg p-2 hover:bg-gray-600 text-white" onClick={() => setOpen(false)}>Cancel</button>
                                  </div>
                                </div>
                              </Modal>
                          <button
                            className="px-2 py-1 h-10 w-35 mb-3 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={() => handleClick(idx)}
                            disabled={addQues && addingToQuizIdx === idx}
                          >
                            Add Question
                          </button>
                          <button
                            className={`px-2 py-1 h-10 w-35 mb-3 bg-yellow-600 text-white rounded hover:bg-yellow-700`}
                            onClick={() => togglePreview(idx)}
                          >
                            Preview
                          </button>
                          <Link to="/quiz">
                          <button
                            className={`px-2 py-1 h-10 w-35 mb-3 mr-2 bg- text-white rounded bg-indigo-700 hover:bg-indigo-900`}
                            onClick={() => sessionStorage.setItem('QuizIndex',idx)}
                          >
                            Take Quiz
                          </button></Link>
                        </td>
                      </tr>
                      {addQues && addingToQuizIdx === idx && (
                        <tr>
                          <td colSpan={4} className="bg-gray-100 dark:bg-gray-900 px-6 py-6">
                            <form onSubmit={addQuestion}>
                              <div>
                                <h2 className="my-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                                  Question Type:
                                </h2>
                                <input
                                  type="radio"
                                  className="my-4 ml-9"
                                  name="type"
                                  onChange={e => setQuestionType("Checkbox")}
                                  checked={questionType === "Checkbox"}
                                />
                                <label className="my-4 ml-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                                  Checkbox
                                </label>
                                <input
                                  type="radio"
                                  className="my-4 ml-9"
                                  name="type"
                                  onChange={e => setQuestionType("Short Answer")}
                                  checked={questionType === "Short Answer"}
                                />
                                <label className="my-4 ml-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                                  Short Answer
                                </label>
                                <input
                                  type="radio"
                                  className="my-4 ml-9"
                                  name="type"
                                  onChange={e => setQuestionType("Radio")}
                                  checked={questionType === "Radio"}
                                />
                                <label className="my-4 ml-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
                                  Radio
                                </label>
                                <button
                                  className="px-3 py-3 ml-12 bg-purple-600 text-white rounded-4xl font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                  type="button"
                                  onClick={submitType}
                                >
                                  Add Type
                                </button>
                              </div>
                              {addType && (
                                    <div>
                                    <h2 className="my-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                                        Question:
                                    </h2>
                                    <input
                                        className="px-4 py-3 w-90 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                        placeholder="Enter Question Statement"
                                        value={questionStatement}
                                        onChange={e => setQuestionStatement(e.target.value)}
                                    />
                                    {(questionType === "Checkbox" || questionType === "Radio") && (
                                        <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                            Options
                                        </label>
                                        {optionInputs.map((opt, oidx) => (
                                            <div key={oidx} className="flex mb-2">
                                            <input
                                                className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:text-gray-200"
                                                placeholder={`Option ${oidx + 1}`}
                                                value={opt}
                                                onChange={e => handleOptionChange(oidx, e.target.value)}
                                                required
                                            />
                                            {optionInputs.length > 1 && (
                                            <>
                                                <button
                                                type="button"
                                                className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                                                onClick={() => removeOptionInput(oidx)}
                                                >
                                                Remove
                                                </button>
                                                {questionType === "Radio" && (
                                                <button
                                                    type="button"
                                                    className={`ml-2 px-2 py-1 ${isCorrectAnswer(oidx) ? "bg-green-600" : "bg-gray-500"} text-white rounded hover:bg-green-700`}
                                                    onClick={() => submitAnswerRadio(oidx)}
                                                    >
                                                    {isCorrectAnswer(oidx) ? "Correct" : "Mark as Correct"}
                                                </button>
                                                )}

                                            </>
                                            )}
                                            </div>
                                      ))}
                                      <button
                                        type="button"
                                        className="mt-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                        onClick={addOptionInput}
                                      >
                                        Add Option
                                      </button>
                                    </div>
                                  )}
                                  <div className="flex justify-end space-x-2">
                                    <button
                                      type="button"
                                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
                                      onClick={cancelAddQuestion}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                    >
                                      Add Question
                                    </button>
                                  </div>
                                </div>
                              )}
                            </form>
                          </td>
                        </tr>
                      )}
                      {previewOpenIdx === idx && quiz.questions && quiz.questions.length > 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 pb-4 bg-white dark:bg-gray-800">
                            <div>
                              <span className="font-semibold text-gray-700 dark:text-gray-200">Questions:</span>
                              <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 mt-2 p-0">
                                {quiz.questions.map((q, qidx) => (
                                  <li key={qidx} className="flex items-center mb-2">
                                    <button
                                      className={`mr-2 px-1 py-0.5 text-lg ${qidx === 0 ? "opacity-30 cursor-default" : "hover:text-purple-700"}`}
                                      style={{lineHeight: "1"}}
                                      disabled={qidx === 0}
                                      onClick={() => moveQuestion(idx, qidx, -1)}
                                      title="Move up"
                                    >🔼</button>
                                    <button
                                      className={`mr-2 px-1 py-0.5 text-lg ${qidx === quiz.questions.length - 1 ? "opacity-30 cursor-default" : "hover:text-purple-700"}`}
                                      style={{lineHeight: "1"}}
                                      disabled={qidx === quiz.questions.length - 1}
                                      onClick={() => moveQuestion(idx, qidx, 1)}
                                      title="Move down"
                                    >🔽</button>
                                    {editingQuestion.quizIdx === idx && editingQuestion.qIdx === qidx ? (
                                      <form
                                        onSubmit={e => {
                                          e.preventDefault();
                                          submitEditQuestion(idx, qidx);
                                        }}
                                        className="flex items-center flex-1"
                                      >
                                        <input
                                          className="flex-1 px-2 py-1 border rounded dark:bg-gray-700 dark:text-gray-100 mr-2"
                                          value={editQuestionValue}
                                          onChange={e => setEditQuestionValue(e.target.value)}
                                          onKeyDown={e => {
                                            if (e.key === "Enter") submitEditQuestion(idx, qidx);
                                            if (e.key === "Escape") cancelEditQuestion();
                                          }}
                                          autoFocus
                                        />
                                        {(q.type === "Checkbox" || q.type === "Radio") && (
                                          <div className="flex flex-col mr-2">
                                            {editQuestionOptions.map((opt, oidx) => (
                                              <div key={oidx} className="flex items-center mb-1">
                                                <input
                                                  className="flex-1 px-2 py-1 border rounded dark:bg-gray-700 dark:text-gray-100"
                                                  value={opt}
                                                  onChange={e => handleEditOptionChange(oidx, e.target.value)}
                                                />
                                                {editQuestionOptions.length > 1 && (
                                                <>
                                                  <button
                                                    type="button"
                                                    className="ml-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                                                    onClick={() => removeEditOptionInput(oidx)}
                                                  >Remove</button>
                                                  {questionType === "Radio" && (
                                                    <button
                                                        type="button"
                                                        className={`ml-2 px-2 py-1 ${isCorrectAnswer(oidx) ? "bg-green-600" : "bg-gray-500"} text-white rounded hover:bg-green-700`}
                                                        onClick={() => submitAnswerRadio(oidx)}
                                                        >
                                                        {isCorrectAnswer(oidx) ? "Correct" : "Mark as Correct"}
                                                    </button>
                                                    )}
                                                </>
                                                )}
                                              </div>
                                            ))}
                                            <button
                                              type="button"
                                              className="mt-1 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                              onClick={addEditOptionInput}
                                            >Add Option</button>
                                          </div>
                                        )}
                                        <button
                                          className="ml-2 px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                                          type="submit"
                                        >Save</button>
                                        <button
                                          className="ml-2 px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                          type="button"
                                          onClick={cancelEditQuestion}
                                        >Cancel</button>
                                      </form>
                                    ) : (
                                      <>
                                        <span className="mr-2">
                                          [{q.type}] {q.statement}
                                          {q.options && q.options.length > 0 && (
                                            <span className="ml-2 text-sm text-gray-500">
                                              (Options: {q.options.join(", ")})
                                            </span>
                                          )}
                                        </span>
                                        <button
                                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
                                          onClick={() => startEditQuestion(idx, qidx)}
                                          title="Edit Question"
                                        >Edit</button>
                                        <button
                                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                                          onClick={() => deleteQuestion(idx, qidx)}
                                          title="Edit Question"
                                        >Delete</button>
                                      </>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}