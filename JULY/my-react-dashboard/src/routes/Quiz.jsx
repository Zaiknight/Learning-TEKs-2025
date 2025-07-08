import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/MainComponent.jsx";

const [quizList, setQuizList] = useState(() => {
    return JSON.parse(localStorage.getItem("quiz_list")) || [];
  });

export default function Quiz(){
    return(
        <SidebarLayout>
            
        </SidebarLayout>
    );
}