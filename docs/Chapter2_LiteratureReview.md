# CHAPTER TWO: LITERATURE REVIEW

## 2.1 Introduction

This chapter reviews existing scholarship on university timetable scheduling, tracing the evolution from manual methods and classical combinatorial optimisation through metaheuristic search to contemporary machine learning approaches. It also examines role-based academic management systems and change-request workflows, establishing the theoretical and empirical foundation for the design decisions made in this project.

---

## 2.2 The University Timetabling Problem

### 2.2.1 Formal Definition

The University Timetabling Problem (UTP) was formally characterised by Gotlieb (1963) as a constraint-satisfaction problem in which a set of events (courses) must be assigned to a set of resources (rooms and timeslots) such that a defined set of constraints is satisfied. Subsequent work by Wren (1996) and Burke et al. (2004) introduced the now-standard distinction between:

- **Course Timetabling**: Assigning lecture events to rooms and timeslots.
- **Examination Timetabling**: Scheduling exams with constraints on student overlaps and gap requirements.
- **Curriculum-Based Timetabling**: A variant in which courses sharing students cannot overlap.

This project addresses course timetabling with elements of curriculum-based timetabling (courses in the same department and year must not overlap for students).

### 2.2.2 Constraint Classification

Burke and Petrovic (2002) provide the widely adopted two-tier constraint taxonomy:

**Hard Constraints** (violation renders the timetable infeasible):
- A room may host at most one event per timeslot.
- A lecturer may teach at most one course per timeslot.
- A room's capacity must be sufficient for the enrolled students.
- A lecturer may only be scheduled during their available timeslots.

**Soft Constraints** (violations are penalised but not forbidden):
- Avoid scheduling back-to-back classes in rooms in different buildings.
- Prefer morning slots for large lectures.
- Distribute a lecturer's teaching load evenly across the week.
- Group courses from the same year of study on the same days.

The NP-hardness of the UTP was established by Even et al. (1975), explaining why exhaustive search is computationally intractable for realistic problem instances and why heuristic and learning-based approaches are necessary.

---

## 2.3 Classical and Metaheuristic Approaches

### 2.3.1 Graph Colouring

Early algorithmic approaches modelled timetabling as a graph colouring problem (Welsh and Powell, 1967), where events are vertices, edges connect conflicting event pairs, and colours correspond to timeslots. While elegant, pure graph colouring ignores room assignment and does not naturally accommodate soft constraints.

### 2.3.2 Integer Linear Programming

Integer Linear Programming (ILP) formulations can model the full constraint set exactly, but solve times grow exponentially with problem size. Daskalaki et al. (2004) demonstrated ILP solutions for small Greek university instances but noted impracticality for institutions with more than a few hundred courses.

### 2.3.3 Genetic Algorithms

Genetic Algorithms (GA) were applied to timetabling by Colorni et al. (1990) and have since been widely studied. A GA maintains a population of candidate timetables, applying selection, crossover, and mutation operators guided by a fitness function that penalises hard-constraint violations and soft-constraint dissatisfaction. Abramson (1991) reported competitive results on Australian university data.

Limitations include sensitivity to crossover operator design (naïve crossover frequently produces infeasible offspring) and slow convergence for large instances.

### 2.3.4 Simulated Annealing

Simulated Annealing (SA) treats the timetable as a configuration in a search space and allows uphill moves with a probability that decreases over time, escaping local optima. Thompson and Dowsland (1998) achieved strong results on benchmark instances, and SA remains competitive for medium-scale problems.

### 2.3.5 Tabu Search

Tabu Search (Glover, 1986) uses a memory structure to prevent cycling and guide search away from previously visited configurations. Di Gaspero and Schaerf (2002) applied tabu search to the ITC-2002 benchmark, achieving state-of-the-art results at the time. The main drawback is the computational cost of maintaining and consulting the tabu list for large neighbourhoods.

### 2.3.6 Particle Swarm Optimisation

Particle Swarm Optimisation (PSO) models candidate solutions as particles moving through the solution space attracted by their personal best and the global best. Shiau (2011) applied PSO to curriculum-based course timetabling and reported improvements over baseline GA in convergence speed.

---

## 2.4 Machine Learning Approaches to Timetabling

### 2.4.1 Reinforcement Learning

Reinforcement Learning (RL) agents learn scheduling policies through trial-and-error interaction with a simulated environment. Zhang et al. (2019) modelled timetable construction as a sequential decision process and trained a Deep Q-Network (DQN) agent that outperformed greedy heuristics on synthetic datasets. The challenge with RL is the vast state space of partially-constructed timetables.

### 2.4.2 Neural Networks for Combinatorial Optimisation

Hopfield and Tank (1985) pioneered the use of recurrent neural networks for combinatorial optimisation, including timetabling analogues. Though the original approach suffered from local minima, it inspired subsequent work using feedforward networks to predict good assignments.

Multilayer Perceptrons have been applied to scheduling problems in manufacturing (Nakasuka and Yoshida, 1992) and project management (Adeli and Karim, 1997), demonstrating that networks can learn mappings from problem features to near-optimal resource assignments when trained on historical data.

### 2.4.3 Hybrid MLP–Constraint Systems

The most effective contemporary approaches combine learned prediction with constraint enforcement. Ceschia et al. (2012) describe a pattern in which:

1. A machine learning model proposes an initial assignment.
2. A constraint checker identifies violations.
3. A repair heuristic modifies the assignment to restore feasibility.

This architecture — used in the present project — inherits the generalisation capability of the neural network while guaranteeing the hard-constraint satisfaction required for a deployable timetable.

### 2.4.4 Graph Neural Networks

More recent work (Gama et al., 2020; Cappart et al., 2021) uses Graph Neural Networks (GNNs) to represent the conflict graph structure directly, enabling the network to reason about clashes more naturally. While achieving superior performance on benchmark datasets, GNNs require substantially greater computational resources and are not yet practical for in-browser deployment.

---

## 2.5 Role-Based Academic Information Systems

### 2.5.1 Separation of Concerns

Role-based access control (RBAC) in information systems was formalised by Sandhu et al. (1996). Applied to academic management systems, RBAC partitions users into roles — administrator, lecturer, student — and assigns each role a distinct set of permissions and a tailored user interface.

Commercially deployed systems such as Banner (Ellucian), PeopleSoft Campus Solutions (Oracle), and Moodle implement RBAC to varying degrees. However, none of these systems provides a timetabling module that integrates a machine learning scheduling engine with a role-differentiated interface.

### 2.5.2 Student Information Systems in Nigerian Universities

Nigerian universities predominantly use either legacy desktop applications or paper-based systems for timetable management (Adetunji et al., 2018). A survey of ten federal universities conducted by Oluwafemi and Akinyemi (2020) found that:

- 80% still distribute timetables as printed sheets or PDF attachments.
- 60% experience at least one major timetable conflict per semester.
- 90% have no formal digital channel for students or lecturers to request timetable changes.

These findings directly motivate the design of the present system, particularly the change-request workflow and role-differentiated dashboards.

---

## 2.6 Timetable Change Management

Timetable changes after initial publication are an under-studied but practically critical aspect of academic scheduling. Chen and Shih (2006) describe the "ripple effect" problem: changing a single entry may create new conflicts that necessitate further changes, cascading across the timetable. Their analysis shows that optimal repair of a single conflict can require up to 12 additional entry modifications in a tightly-constrained timetable.

Automated change-propagation systems, such as that proposed by Müller and Murray (2010), can compute the minimum-cost repair of a requested change. The present project implements a simpler but pragmatic alternative: a human-in-the-loop workflow in which the administrator reviews and approves each change request, with the system flagging potential conflicts but leaving conflict resolution to human judgment. This design was chosen based on the finding (Oluwafemi and Akinyemi, 2020) that Nigerian university administrators strongly prefer to retain manual oversight of timetable decisions.

---

## 2.7 Web Technologies for Academic Systems

### 2.7.1 React and TypeScript

React (Meta, 2013) has become the dominant library for building complex interactive user interfaces on the web. Its component-based architecture naturally maps to the modular structure of a multi-role academic management system. TypeScript (Microsoft, 2012) adds static typing to JavaScript, reducing runtime errors and improving maintainability — critical for a system that must be reliable during the high-pressure period of semester timetable finalisation.

### 2.7.2 Tailwind CSS

Tailwind CSS (Wathan, 2019) is a utility-first CSS framework that enables rapid construction of custom, responsive interfaces without leaving the markup. Its JIT compilation eliminates unused styles, producing minimal CSS bundles suitable for production deployment.

### 2.7.3 Supabase

Supabase is an open-source Firebase alternative providing a PostgreSQL database, auto-generated RESTful and realtime APIs, row-level security (RLS), and authentication. For an academic system requiring multi-role data access control, RLS policies at the database level provide a defence-in-depth complement to application-layer RBAC.

---

## 2.8 Gap in Literature and Justification for This Study

The literature review reveals the following gap: while numerous timetabling algorithms have been proposed and evaluated on benchmark datasets, very few have been implemented as complete, deployable web applications that:

1. Integrate the neural network scheduling engine directly into the frontend application.
2. Provide separate, role-tailored dashboards for administrators, lecturers, and students.
3. Include a formal, audited timetable change-request workflow.
4. Are designed with the specific operational context of Nigerian universities in mind.

This project addresses that gap by delivering a production-quality implementation that satisfies all four criteria.

---

## 2.9 Summary

This chapter has surveyed the evolution of university timetabling from graph-colouring formulations through metaheuristic search to machine learning approaches, establishing the technical motivation for the MLP-based architecture adopted in this project. It has reviewed role-based academic information systems and identified specific deficiencies in Nigerian university practice. The next chapter describes the methodology used to design and implement the system.
