<?php
session_start();
if (!isset($_SESSION['token'], $_SESSION['id'], $_SESSION['username'])) {
    header('Location: homepage.html');
    exit();
}
$username = htmlspecialchars($_SESSION['username']);
$token    = $_SESSION['token'];
$userId   = $_SESSION['id'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Task Manager</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-..." crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
  <header class="header">
    <div class="user-info">
      <i class="fas fa-user-circle"></i>
      <span>Welcome, <?= $username ?></span>
    </div>
    <form method="post" action="logout.php">
      <button class="logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        Logout
      </button>
    </form>
  </header>

  <div class="main-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <button class="nav-btn"><i class="fas fa-plus-circle"></i> Add Task</button>
      <button class="nav-btn"><i class="fas fa-tasks"></i> Show Tasks</button>
    </aside>

    <!-- Main content -->
    <div class="content-area">
      <!-- Form area -->
      <section class="form-area" id="form-area" style="display: none;">
        <input id="title" placeholder="Task Title" />
        <textarea id="desc" placeholder="Task Description" rows="3" style="resize: vertical;"></textarea>
        <button id="addBtn">Add Task</button>
      </section>

      <!-- Board area -->
      <main class="board" id="task-board">
        <div class="column">
          <h2>Important</h2>
          <div id="important-tasks">Loading…</div>
        </div>
        <div class="column">
          <h2>Incomplete</h2>
          <div id="incomplete-tasks">Loading…</div>
        </div>
        <div class="column">
          <h2>Complete</h2>
          <div id="complete-tasks">Loading…</div>
        </div>
      </main>
    </div>
  </div>

  <script>
    const BASE   = "http://localhost:1000/api/v2";
    const token  = "<?= $token ?>";
    const userId = "<?= $userId ?>";

    function showAddForm() {
      document.getElementById('form-area').style.display = 'flex';
      document.getElementById('task-board').style.display = 'none';
    }

    function showTaskBoard() {
      document.getElementById('form-area').style.display = 'none';
      document.getElementById('task-board').style.display = 'flex';
    }

    document.querySelector(".sidebar .nav-btn:first-child").addEventListener("click", showAddForm);
    document.querySelector(".sidebar .nav-btn:last-child").addEventListener("click", showTaskBoard);

    document.getElementById("addBtn").addEventListener("click", function () {
      // Add task logic from script.js (assumes script.js handles it)
      setTimeout(showTaskBoard, 1000);
    });
  </script>
  <script src="script.js"></script>
</body>
</html>
