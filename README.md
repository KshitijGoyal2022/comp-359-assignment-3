# Want to find a path? Visualize It!

## Topic

**Visualization of Various Informed and Uninformed Search Algorithms**  

This project involves creating a program that visualizes the following search algorithms:  
- Uninformed Search: **DFS (Depth-First Search)**, **BFS (Breadth-First Search)**  
- Informed Search: **Greedy Search**, **A\***, **Uniform Cost Search (UCS)**  

The goal is to help users understand the inner workings of these algorithms through animation and statistical data.

### Live Version  
[Visit the Application](https://ufv-comp-359-a3.vercel.app/)

---

## Team Members

- **Ishwak Sharda** (300205473 - ishwak.sharda@student.ufv.ca)  
- **Kshitij Goyal** (300197764 - kshitij.goyal@student.ufv.ca)  
- **Joshua Lepon** (300189001 - joshuakarle.lepon@student.ufv.ca)

Each team member contribution can be seen in the closed issues section or Github board.

---

## Source Code

- **Web Implementation (TypeScript):** [Repository Link](https://github.com/KshitijGoyal2022/comp-359-assignment-3)  
- **GitHub Board:** [Task Board](https://github.com/users/KshitijGoyal2022/projects/2)

---

## Features and Requirements

### Features
1. **Side-by-Side Visualization:**  
   Users can select two algorithms to run simultaneously for comparison. The animations play side-by-side, allowing users to observe their behavior.

2. **Statistical Data:**  
   The following metrics are displayed for each algorithm:
   - **Execution Time:** How long the algorithm takes to complete.
   - **Nodes Visited:** Total number of nodes explored during the search.
   - **Path Cost:** Total cost of the resulting path (if applicable).
   - **Steps:** Users can navigate forward or backward through the animation to understand each step of the algorithm.

3. **Progress Indicator:**  
   A progress bar shows how far each algorithm has progressed in real-time.

4. **Customizable Settings:**  
   Users can adjust:
   - **Grid Size**: Number of rows and columns in the grid.
   - **Start and End Points**: Positions of the source and target nodes.
   - **Dynamic Obstacles**: Whether obstacles move during the animation.

---

## Technologies Used

- **Frontend:** React, Next.js, TailwindCSS  
- **Animation & Visualization:** p5.js  
- **Programming Language:** TypeScript  
- **Testing:** Vitest  

---

## Algorithms Implemented

### **Uninformed Search Algorithms**

1. **BFS (Breadth-First Search):**  
   Time Complexity: O(V + E)  
   - Explores all neighbors of a node before moving to the next level.
   - Visualization implemented with a queue-based approach.

   **Pseudocode:**
   ```plaintext
   BFS(graph, start_node):
       create a queue Q
       mark start_node as visited
       enqueue start_node into Q

       while Q is not empty:
           current_node = dequeue Q
           for each neighbor in graph.neighbors(current_node):
               if neighbor is not visited:
                   mark neighbor as visited
                   enqueue neighbor into Q
   ```

2. **DFS (Depth-First Search):**  
   Time Complexity: O(V + E)  
   - Explores as deep as possible along each branch before backtracking.
   - Visualization implemented using recursion and a stack.

   **Pseudocode (Recursive):**
   ```plaintext
   DFS(graph, node, visited):
       mark node as visited
       for each neighbor in graph.neighbors(node):
           if neighbor is not visited:
               DFS(graph, neighbor, visited)
   ```

   **Pseudocode (Iterative):**
   ```plaintext
   DFS(graph, start_node):
       create a stack S
       push start_node onto S
       while S is not empty:
           current_node = pop S
           if current_node is not visited:
               mark current_node as visited
               for each neighbor in graph.neighbors(current_node):
                   if neighbor is not visited:
                       push neighbor onto S
   ```

### **Informed Search Algorithms**

1. **Greedy Search:**  
   Time Complexity: O(n log n)  
   - Selects the node closest to the goal based on a heuristic.  
   - May not find the optimal path.  

   **Pseudocode:**
   ```plaintext
   GreedySearch(graph, start_node, goal_node, heuristic):
       create an empty set visited
       create a priority queue Q
       enqueue start_node into Q with priority heuristic(start_node)

       while Q is not empty:
           current_node = dequeue Q
           if current_node is goal_node:
               return path from start_node to goal_node
           mark current_node as visited
           for each neighbor in graph.neighbors(current_node):
               if neighbor is not visited:
                   enqueue neighbor into Q with priority heuristic(neighbor)
   ```

2. **A\* (A-Star Search):**  
   Time Complexity: O(n log n)  
   - Combines the cost to reach a node (g) and the estimated cost to reach the goal (h).  
   - Always finds the optimal path if the heuristic is admissible.  

   **Pseudocode:**
   ```plaintext
   AStarSearch(graph, start_node, goal_node, heuristic):
       create an empty set closed_set
       create a priority queue open_set
       g_score = map with default value infinity
       g_score[start_node] = 0
       enqueue start_node into open_set with priority g_score[start_node] + heuristic(start_node)
       came_from = empty map

       while open_set is not empty:
           current_node = dequeue open_set
           if current_node is goal_node:
               return reconstruct_path(came_from, current_node)
           add current_node to closed_set
           for each neighbor in graph.neighbors(current_node):
               if neighbor in closed_set:
                   continue
               tentative_g_score = g_score[current_node] + cost(current_node, neighbor)
               if tentative_g_score < g_score[neighbor]:
                   came_from[neighbor] = current_node
                   g_score[neighbor] = tentative_g_score
                   f_score = g_score[neighbor] + heuristic(neighbor)
                   enqueue neighbor into open_set with priority f_score
   ```

3. **Uniform Cost Search (UCS):**  
   Time Complexity: O(n log n) on average, O(n²) in the worst case  
   - Expands the least-cost node first, ignoring heuristics.  
   - Suitable for graphs with varying edge weights.  

   **Pseudocode:**
   ```plaintext
   UniformCostSearch(graph, start_node, goal_node):
       create a priority queue Q
       enqueue start_node into Q with priority 0
       cost_so_far = map with default value infinity
       cost_so_far[start_node] = 0
       came_from = empty map

       while Q is not empty:
           current_node = dequeue Q
           if current_node is goal_node:
               return reconstruct_path(came_from, current_node)
           for each neighbor in graph.neighbors(current_node):
               new_cost = cost_so_far[current_node] + cost(current_node, neighbor)
               if new_cost < cost_so_far[neighbor]:
                   cost_so_far[neighbor] = new_cost
                   enqueue neighbor into Q with priority new_cost
                   came_from[neighbor] = current_node
   ```
---

## Planning and Collaboration

1. **GitHub for Version Control and Task Assignment:**  
   - Codebase versioning and branching.  
   - Task assignment via [GitHub Project Board](https://github.com/users/KshitijGoyal2022/projects/2).  

2. **ReadMe Documentation:**  
   - Tasks divided among team members and logged here for transparency.  

---

### References

1. ["Greedy Best-First Search Algorithm" - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-best-first-search-algorithm/?utm_source=chatgpt.com)  
   A detailed explanation of the Greedy Best-First Search algorithm, its working, and practical examples.

2. ["Uniform-Cost Search vs. Best-First Search" - Baeldung](https://www.baeldung.com/cs/uniform-cost-search-vs-best-first-search?utm_source=chatgpt.com)  
   A comparison of Uniform-Cost Search and Best-First Search, discussing their differences and applications.

3. **"Artificial Intelligence: A Modern Approach" by Stuart Russell and Peter Norvig**  
   Comprehensive textbook covering the theoretical and practical aspects of AI, including BFS, DFS, UCS, Greedy Search, and A*. Available [here](https://aima.cs.berkeley.edu/).

4. **"Data Structures and Algorithm Analysis in Java" by Clifford A. Shaffer**  
   Chapter 11.3, 11.3.1, and 11.3.2 provide insights into search algorithms, heuristics, and graph traversals.

5. [Understanding Hinton's Capsule Networks - Medium](https://medium.com/@dipalimajet/understanding-hintons-capsule-networks-c2b17cd358d7)  
   Explains Hinton's Capsule Networks with simplified examples, which can offer inspiration for pathfinding and optimization techniques.

6. [A* Algorithm - A Detailed Explanation](https://mat.uab.cat/~alseda/MasterOpt/AStar-Algorithm.pdf)  
   A concise and clear explanation of the A* algorithm with mathematical insights and visual examples.

7. https://chatgpt.com/share/674a464b-06c8-800c-99f7-26adaabc9824
   Issues with the Grid where the scroll part would be broken when several algorithms are selected, causing the content to not show up.

---

### Notes

- Adjustments were made to improve clarity, fix errors, and align the README with the actual project.  
- For further details, visit the [live version](https://ufv-comp-359-a3.vercel.app/).
