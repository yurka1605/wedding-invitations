function setAnswer(answer) {
    fetch(`${window.location.origin}/api/answer${window.location.search}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8'},
      body: JSON.stringify({answer})
    });
}