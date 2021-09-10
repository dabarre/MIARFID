% 
% Restaurant Scheduling problem in MiniZinc.
%

include "globals.mzn"; 

% Defined variables
int: days = 7;
int: work_days = 5;
int: free_days = days-work_days;
int: num_employees = 8;
% full-morning, half-mmorning,
% full-afternoon and half-afternoon
int: turns = 4;

array[1..turns,1..days] of int: needed;
array[1..num_employees,1..days] of int: available;
array[1..num_employees] of int: contract_hours;

%         M T W T F S S
%needed = [4,4,5,6,7,6,4];
needed = array2d(1..turns, 1..days,
    [
    %   M T W T F S S
        2,2,2,2,2,2,2,
        0,0,1,2,2,3,2,
        2,2,2,2,2,2,0,
        0,0,1,2,3,3,0,
    ]);
% Doesn't take into account morning and afternoon shifts
available = array2d(1..num_employees, 1..days,
    [
    %   M T W T F S S
    %   Cocineros
    %    1,1,1,1,1,1,1,  % Juan
    %    1,1,1,1,1,1,1,  % Rebeca
    %    1,1,1,1,1,1,1,  % Esperanza
    %   Camareros
        1,1,1,1,1,0,0,  % Narciso
        1,1,1,1,1,1,1,  % Amancio
        1,1,1,1,1,1,1,  % Andromeda
        0,0,0,0,1,1,1,  % Marta
        0,0,0,0,1,1,1,  % Julio
    ]);
contract_hours = [40,40,20,40,40,40,20,20];

% Decision variables
% 0: rest day
% 1: morning
% 2: half-morning
% 3: afternoon
% 4: half-afternoon
% 5: split day
array[1..num_employees, 1..days] of var 0..5: timetable;

% Name enums

%int: cost_per_day = 100;


% Number to hire each day
%array[1..days] of var 0..15: x;
% Number of people working this day
%array[1..days] of var 0..num_employees: working; % ??????

%var int: total_cost = sum(i in 1..days) ( work_days*cost_per_day*x[i]);

constraint 
    % Checks if n employees are available when needed
    % Valid, doesn't take into account morning and afternoon shifts
    %forall(i in 1..num_employees, j in 1..days) (
    %    timetable[i,j] <= available[i,j]
    %) /\
    % Checks if n employees are available when needed
    % fm<-1 hm<-2,5 fa<-3 ha<-4,5
    forall(j in 1..days) (
        % Check morning
        sum(i in 1..num_employees where timetable[i,j]=1) (timetable[i,j]) >= needed[1,j]
        %/\
        % Check half morning
        %sum(i in 1..num_employees where timetable[i,j]=2 \/ timetable[i,j]=5) (timetable[i,j]) >= needed[2,j]
        %/\
        % Check afternoon
        %sum(i in 1..num_employees where timetable[i,j]=3) (timetable[i,j]) >= needed[3,j]
        %/\
        % Check half afternoon
        %sum(i in 1..num_employees where timetable[i,j]=4 \/ timetable[i,j]=5) (timetable[i,j]) >= needed[4,j]
    ) /\
    % Checks that every employee works 5 days
    % Should be = but 2 employees work 3 days -> change to employement contract hours
    forall(i in 1..num_employees) (
        sum(j in 1..days) (timetable[i,j]) <= work_days
    )
    % Checks workers don't work more than their contract states
;

solve satisfy;
% solve minimize total_cost;

% Change normal solver -> search 
% -> particular combinatorial integer problems
% -> specify search strategy by annotations
% -> depth first search
%solve :: int_search(timetable, first_fail, indomain_min, complete) satisfy;

output [ 
    "needed     : " ++ show(needed) ++ "\n" ++
    "timetable  : " ++ show(timetable) ++ "\n" %++
%    "total_cost : " ++ show(total_cost) ++ "\n" ++
%    "x          : " ++ show(x) ++ "\n" ++
%    "working    : " ++ show(working) ++ "\n" ++
%    "num_workers: " ++ show(sum([x[i] | i in 1..days]))
]
    ++ ["\n"]
;


