# CHAPTER ONE: INTRODUCTION

## 1.1 Background to the Study

University timetabling is one of the most complex combinatorial optimisation problems encountered in academic administration. A timetable must satisfy numerous hard constraints — preventing two classes from occupying the same room simultaneously, ensuring no lecturer teaches two courses at the same time, matching room capacities to expected class sizes — while simultaneously optimising for soft constraints such as distributing workloads evenly, avoiding early morning or late evening slots where possible, and grouping related courses to minimise student travel time between venues.

Traditionally, timetable scheduling has been performed manually by experienced academic administrators. This approach is not only labour-intensive and time-consuming — often taking weeks to finalise even for mid-sized departments — but is also highly prone to human error, conflicts, and inefficiencies. When changes are required after publication, the ripple effect through the schedule can necessitate extensive rework. Furthermore, manual processes scale poorly: as universities grow and course offerings expand, the combinatorial complexity of the scheduling problem grows exponentially.

Computational approaches to timetabling have been explored since the 1960s, with methods evolving from simple constraint-propagation algorithms through heuristic search techniques such as genetic algorithms, simulated annealing, tabu search, and particle swarm optimisation. More recently, machine learning — and specifically deep learning — has demonstrated the potential to learn scheduling preferences and patterns from historical data, offering a data-driven complement to classical constraint solvers.

This project develops a **Multilayer Perceptron (MLP)-Based University Timetable Scheduling System**: a production-ready web application that combines a deep neural network for schedule prediction with a rigorous constraint-validation layer, all presented through a role-differentiated web interface built on modern frontend technologies.

---

## 1.2 Statement of the Problem

Nigerian universities and, more broadly, universities in developing nations continue to rely on manual or semi-automated timetabling processes. The key problems identified include:

1. **Conflict-prone scheduling**: Manual processes routinely produce timetables in which lecturers are double-booked, rooms exceed their stated capacity, or two courses required by the same set of students overlap.

2. **Slow iteration cycle**: Any change to one entry in the timetable may cascade into dozens of dependent changes, and the manual propagation of these changes can take days.

3. **Lack of role-based access**: Existing systems typically provide a single view for all stakeholders. Administrators, lecturers, and students have fundamentally different informational needs, yet are forced to navigate the same interface.

4. **No formal change-request workflow**: When a lecturer needs to reschedule a class — due to a conference, illness, or departmental event — the current informal process (phone calls, WhatsApp messages, notice boards) is unreliable and poorly documented.

5. **Inability to learn from history**: Manual and rule-based systems cannot improve over time; they do not capture and exploit the patterns present in years of historical scheduling decisions.

---

## 1.3 Aim and Objectives

**Aim**: To design, implement, and evaluate a web-based university timetable scheduling system that uses a Multilayer Perceptron neural network to learn from historical scheduling patterns and generate conflict-free timetables, with role-differentiated dashboards for administrators, lecturers, and students, and a formal workflow for timetable change requests.

**Objectives**:

1. To review existing literature on automated timetable scheduling, including classical optimisation methods and machine learning approaches.
2. To design a relational database schema capable of representing all entities relevant to university timetabling (courses, lecturers, rooms, timeslots, timetable entries, change requests).
3. To implement a Multilayer Perceptron neural network in TypeScript that learns from historical scheduling data and predicts optimal timeslot assignments for given courses.
4. To develop a constraint-validation layer that verifies MLP outputs against hard scheduling constraints and applies a repair mechanism when violations are detected.
5. To build a responsive, production-quality React/TypeScript web application with separate dashboards for administrators, lecturers, and students.
6. To implement a course management module allowing administrators to add, edit, and delete courses directly from the web interface.
7. To implement a timetable change-request workflow enabling lecturers and students to submit reschedule requests and administrators to approve or reject them with recorded responses.
8. To evaluate the system through functional testing and user acceptance testing.

---

## 1.4 Significance of the Study

This study is significant on several dimensions:

- **Practical impact**: The system directly addresses real administrative pain points experienced by thousands of universities. A working implementation can be adopted or adapted by any institution with minimal configuration.

- **Technical contribution**: The integration of an in-browser neural network (implemented in pure TypeScript without a heavyweight framework dependency) with a constraint-repair heuristic represents a novel approach that keeps the entire scheduling pipeline within the client, reducing latency and infrastructure costs.

- **Role-based design contribution**: The three-tier dashboard architecture (Admin / Lecturer / Student) establishes a clear separation of concerns that can serve as a template for other academic management systems.

- **Process contribution**: The formalised change-request workflow, with audit trail and admin-response logging, provides a model for moving Nigerian universities from informal ad hoc rescheduling to a documented, accountable process.

---

## 1.5 Scope and Limitations

**Scope**: The system covers the scheduling of taught courses within a single university. It manages courses, lecturers, physical rooms, and timeslots, and produces a weekly recurring timetable for a given semester. The change-request module covers requests for single-entry reschedules within the same semester.

**Limitations**:

- The current implementation uses in-memory mock data rather than a live Supabase connection, meaning data does not persist across browser sessions. A production deployment would replace the mock-data layer with the provided Supabase schema and client.
- The MLP is trained in the browser using a simulated dataset; a production system would pre-train on historical university scheduling records exported from the institution's student information system.
- The system does not yet handle exam timetabling, which requires additional constraint types (student group clashes, invigilator availability).
- Mobile optimisation is present (responsive layout) but a native mobile application is outside the current scope.

---

## 1.6 Definition of Terms

| Term | Definition |
|------|------------|
| **MLP (Multilayer Perceptron)** | A class of feedforward artificial neural network consisting of at least three layers of nodes (input, one or more hidden, output), trained via backpropagation. |
| **Hard Constraint** | A scheduling rule that must never be violated (e.g., no room double-booking). |
| **Soft Constraint** | A scheduling preference that should be satisfied where possible but may be violated without invalidating the timetable. |
| **Timeslot** | A combination of a day of the week and a contiguous block of time (e.g., Monday 08:00–10:00). |
| **Timetable Entry** | A tuple ⟨course, lecturer, room, timeslot⟩ representing one scheduled class. |
| **Change Request** | A formal submission by a lecturer or student asking for a scheduled class to be moved to a different day or time. |
| **ReLU** | Rectified Linear Unit activation function: f(x) = max(0, x). |
| **Softmax** | A normalising activation function that converts a vector of real numbers into a probability distribution. |
| **CRUD** | Create, Read, Update, Delete — the four basic operations of persistent data management. |
| **API** | Application Programming Interface — a contract for communication between software components. |

---

## 1.7 Organisation of the Report

The remainder of this report is structured as follows:

- **Chapter Two** presents a review of related literature, covering the history of automated timetabling, machine learning in scheduling, and the specific characteristics of Nigerian university scheduling problems.
- **Chapter Three** describes the research methodology, including the system development lifecycle adopted, data modelling, neural network design, and constraint system architecture.
- **Chapter Four** presents the implementation details, covering the technology stack, component architecture, key algorithms, and user-interface design.
- **Chapter Five** concludes the report with a summary of findings, evaluation of the system against its stated objectives, limitations encountered, and recommendations for future work.
