% 
% Restaurant Scheduling problem (PuzzlOR) in MiniZinc.
%
% Among the hundreds of details with opening a restaurant, you need to
% hire and schedule employees. You expect that you will need the following 
% number of employees each day:
% 
% Employees Schedule 	 
% Day of week 	Employees Needed
% Monday 	4    -> 4
% Tuesday 	5   -> 4
% Wednesday 	5 -> 6
% Thursday 	10 -> 8
% Friday 	12   -> 9
% Saturday 	12 -> 10
% Sunday 	2    -> 4
%
% Satisfy schedule, hire each day if needed
% Own workload
%

include "globals.mzn"; 

int: days = 7;
int: work_days = 5;
int: free_days = days-work_days;

%                                M T W T F  S S
%array[1..days] of int: needed = [4,4,6,8,9,10,4];
array[1..days] of int: needed = [4,4,5,6,7, 6,4];

int: num_employees = 8;
array[1..num_employees,1..days] of int: available;

available = array2d(1..num_employees, 1..days,
    [
    %   M T W T F S S
    %   Cocineros
        1,1,1,1,1,1,1,  % Juan
        1,1,1,1,1,1,1,  % Rebeca
        1,1,1,1,1,1,1,  % Esperanza
    %   Camareros
        1,1,1,1,1,0,0,  % Narciso
        1,1,1,1,1,1,1,  % Amancio
        1,1,1,1,1,1,1,  % Andromeda
        0,0,0,0,1,1,1,  % Marta
        0,0,0,0,1,1,1,  % Julio
    ]);

% Decision variables
array[1..num_employees, 1..days] of var 0..1: timetable;

% Name enums

%int: cost_per_day = 100;


% Number to hire each day
%array[1..days] of var 0..15: x;
% Number of people working this day
%array[1..days] of var 0..num_employees: working; % ??????

%var int: total_cost = sum(i in 1..days) ( work_days*cost_per_day*x[i]);

constraint 
    % Checks if n employees are available when needed
    forall(i in 1..num_employees, j in 1..days) (
        timetable[i,j] <= available[i,j]
    ) /\
    % Checks if n employees are available when needed
    forall(j in 1..days) (
        sum(i in 1..num_employees) (timetable[i,j]) >= needed[j]
    ) /\
    % Checks that every employee works 5 days
    % Should be = but 2 employees work 3 days -> change to employement contract hours
    forall(i in 1..num_employees) (
        sum(j in 1..days) (timetable[i,j]) <= work_days
    )
;

%constraint
%   % For every day working must be greater than needed
%   % Employees take 2 days off
%   forall(d in 1..days) (
%     let {
%        %array[1..work_days] of var int: tmp = [x[i] | i in d..min(days,d+work_days-1)] ++ [x[i] | i in 1..d-work_days where d + work_days -1 > days]
%        array[1..work_days] of var int: tmp = [x[i] | i in d..min(days,d+work_days-1)] ++ [x[i] | i in 1..d-work_days+2 where d + work_days-1 > days]
%     } in
%     trace("d: " ++ show(tmp) ++ "\n", 1=1) /\
%     working[d] = sum(tmp) /\
%     working[d] >= needed[d]
%   )
%;

solve satisfy;
% solve minimize total_cost;

% Change normal solver -> search 
% -> particular combinatorial integer problems
% -> specify search strategy by annotations
% -> depth first search
%solve :: int_search(x, first_fail, indomain_min, complete) minimize total_cost;

output [ 
  "needed     : " ++ show(needed) ++ "\n" ++
  "timetable  : " ++ show(timetable) ++ "\n" %++
%  "total_cost : " ++ show(total_cost) ++ "\n" ++
%  "x          : " ++ show(x) ++ "\n" ++
%  "working    : " ++ show(working) ++ "\n" ++
%  "num_workers: " ++ show(sum([x[i] | i in 1..days]))
] 
 ++ ["\n"]
;



%int:_num_workers = 2;
%int: num_weeks = 3;
%int: num_days = 4;
%array[1..num_workers,1..num_weeks,1..num_days] of int: a =
%        (1..num_workers,1..num_weeks,1..num_days,
%    [
        % worker 1
        % week1   week2     week3
%        1,0,0,1,  1,1,0,1,  0,0,1,1,

        % worker 2
        % week1   week2      week3
%        1,0,0,0,  0,0,0,1,   1,1,1,0
%    ]);


