function setData() {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("id");

  fetch(`https://apict.pnu.app/quiz/${quizId}/subject`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("네트워크 응답이 옳지 않습니다.");
        console.log("problemId: ", problemId);
      }
      return response.json();
    })
    .then((data) => {
      const subjectManage = document.getElementById("subjectManage");
      subjectManage.onclick = function () {
        location.href = `course.html?id=${quizId}&&title=${data.title}`;
      };
      const mistakeNote = document.getElementById("mistakeNote");
      mistakeNote.onclick = function () {
        location.href = "note.html";
      };
      const gradeStat = document.getElementById("gradeStat");
      document.getElementById("subjectName").innerHTML = data.title;
      document.getElementById("progressBar").value = data.progress;
      document.getElementById("percentNum").innerHTML = data.progress + "%";
      document.getElementsByClassName("cheerPhrase")[0].innerHTML = data.text;
    });

  var recentjsonData = "{ 'quiz_id': " + quizId + " }";
  fetch(`https://apict.pnu.app/subject/chapter/quiz/${quizId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("네트워크 응답이 옳지 않습니다.");
        console.log("recentId: ", recentId);
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("quizTitle").innerHTML = data.chapter.title;
      createContainer(data.problem);
      console.log(data.problem);
    });
}

function loadHeader() {
  fetch("./header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header").innerHTML = data;
    });
}

function submitAns(id) {
  const submitAns = document.getElementById(`submitAns${id}`);
  const quizAnswer = document.getElementById(`quizAnswer${id}`);
  if (quizAnswer.value.length == 0) return;
  // submitAns.style.display = "none";
  var jsonData = `{ "user_answer": "${quizAnswer.value}" }`;
  fetch(`https://apict.pnu.app/subject/chapter/quiz/problem/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ user_answer: quizAnswer.value }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("네트워크 응답이 옳지 않습니다.");
      }
      return response.json();
    })
    .then((data) => {
      submitAns.disabled = true;
      quizAnswer.disabled = true;
      const quizTF = document.getElementById(`quizTF${id}`);
      quizTF.style.display = "block";
      var judgeTF = data.is_correct;
      if (judgeTF == true) {
        judgeTF = "정답입니다.";
        quizTF.style.color = "rgba(12, 109, 255, 1)";
      } else {
        judgeTF = "오답입니다.<br>" + data.feedback;
        quizTF.style.color = "red";
      }
      quizTF.innerHTML = judgeTF;
      document.getElementById(`clearAns${id}`).style.display = "block";
      document.getElementById(`viewAns${id}`).style.display = "block";
    });
}

function clearAns(id) {
  const quizAnswer = document.getElementById(`quizAnswer${id}`);
  const quizTF = document.getElementById(`quizTF${id}`);
  const quizSolution = document.getElementById(`quizSolution${id}`);
  fetch(`https://apict.pnu.app/subject/chapter/quiz/problem/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  quizAnswer.disabled = false;
  quizAnswer.value = "";
  quizTF.innerHTML = "";
  quizTF.style.display = "none";
  quizSolution.innerHTML = "";
  quizSolution.style.display = "none";
}

function viewAns(id) {
  const viewAns = document.getElementById(`viewAns${id}`);
  const quizSolution = document.getElementById(`quizSolution${id}`);
  viewAns.disabled = true;
  // viewAns.style.display = "none";
  fetch(`https://apict.pnu.app/subject/chapter/quiz/problem/${id}/solution`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("네트워크 응답이 옳지 않습니다.");
        console.log("quizId: ", quizId);
      }
      return response.json();
    })
    .then((data) => {
      quizSolution.style.display = "block";
      quizSolution.innerHTML = data.solution;
    });
}

function setStat() {}
