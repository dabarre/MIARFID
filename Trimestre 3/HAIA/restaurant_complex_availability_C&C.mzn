% 
% Restaurant Scheduling problem in MiniZinc.
%

include "globals.mzn"; 

% Defined variables
int: days = 7;
int: work_days = 5;
int: free_days = days-work_days;



int: num_employees = 8;
int: num_chefs = 3;
int: num_waiters = 5;

% full-morning, half-morning,
% full-afternoon and half-afternoon
int: turns = 4;
array[1..5] of int: working_hours;

% Treated as 2 different problems
array[1..turns,1..days] of int: chefs_needed;
array[1..num_chefs,1..days] of int: chefs_available;
array[1..num_chefs] of int: chefs_contract;

array[1..turns,1..days] of int: waiters_needed;
array[1..num_waiters,1..days] of int: waiters_available;
array[1..num_waiters] of int: waiters_contract;

%                fm hm fa ha sd
working_hours = [8,4,8,4,8];

%         M T W T F S S
%needed = [4,4,5,6,7,6,4];
chefs_needed = array2d(1..turns, 1..days,
    [
    %   M T W T F S S
        1,1,1,1,1,1,1,
        0,0,0,0,0,0,0,
        1,1,1,1,1,1,0,
        0,0,0,0,0,0,0,
    ]);
waiters_needed = array2d(1..turns, 1..days,
    [
    %   M T W T F S S
        1,1,1,1,1,1,1,
        0,0,1,2,2,3,2,
        1,1,1,1,1,1,0,
        0,0,1,2,3,3,0,
    ]);
    
% Doesn't take into account morning and afternoon shifts
chefs_available = array2d(1..num_chefs, 1..days,
    [
    %   M T W T F S S
    %   Chefs
        1,1,1,1,1,1,1,  % Juan
        1,1,1,1,1,1,1,  % Rebeca
        1,1,1,1,1,1,1,  % Esperanza
    %   Waiters
    %    1,1,1,1,1,0,0,  % Narciso
    %    1,1,1,1,1,1,1,  % Amancio
    %    1,1,1,1,1,1,1,  % Andromeda
    %    0,0,0,0,1,1,1,  % Marta
    %    0,0,0,0,1,1,1,  % Julio
    ]);
waiters_available = array2d(1..num_waiters, 1..days,
    [
    %   M T W T F S S
    %   Waiters
        1,1,1,1,1,0,0,  % Narciso
        1,1,1,1,1,1,1,  % Amancio
        1,1,1,1,1,1,1,  % Andromeda
        0,0,0,0,1,1,1,  % Marta
        0,0,0,0,1,1,1,  % Julio
    ]);
chefs_contract = [40,40,20];
waiters_contract = [40,40,40,20,20];

% Decision variables
% 0: rest day
% 1: morning
% 2: half-morning
% 3: afternoon
% 4: half-afternoon
% 5: split day
array[1..num_chefs, 1..days] of var 0..5: chefs_timetable;
%array[1..num_waiters, 1..days] of var 0..5: waiters_timetable;

% Chefs constraints
constraint 
    % Checks if n employees are available when needed
    % Valid, doesn't take into account morning and afternoon shifts
    forall(i in 1..num_chefs, j in 1..days) (
        %chefs_timetable[i,j] <= chefs_available[i,j]
        chefs_timetable[i,j] = 0 
        \/
        (chefs_timetable[i,j] > 0 /\ chefs_available[i,j] = 1)
    ) /\
    % Checks if n employees are available when needed
    % fm<-1 hm<-2,5 fa<-3 ha<-4,5
    forall(j in 1..days) (
        % Check morning
%        sum(i in 1..num_chefs where chefs_timetable[i,j]=1) (chefs_timetable[i,j]) >= chefs_needed[1,j]
        sum(i in 1..num_chefs where chefs_timetable[i,j]=1) (1) >= chefs_needed[1,j]
        /\
        % Check half morning
        %sum(i in 1..num_employees where timetable[i,j]=2 \/ timetable[i,j]=5) (timetable[i,j]) >= needed[2,j]
        sum(i in 1..num_employees where chefs_timetable[i,j]=2 \/ chefs_timetable[i,j]=5) (1) >= chefs_needed[2,j]
%        let {
%            var float: tmp1 = sum(i in 1..num_chefs where chefs_timetable[i,j]=2) (chefs_timetable[i,j])/2
%        } in trace("d: " ++ show(tmp1) ++ "\n", 1=1) /\
%        let {
%            var float: tmp2 = sum(i in 1..num_chefs where chefs_timetable[i,j]=5) (chefs_timetable[i,j])/5
%        } in trace("d: " ++ show(tmp2) ++ "\n", 1=1) /\
%        tmp1 + tmp2 >= chefs_needed[2,j]
        /\
        % Check afternoon
%        sum(i in 1..num_chefs where chefs_timetable[i,j]=3) (chefs_timetable[i,j])/3 >= chefs_needed[3,j]
        sum(i in 1..num_chefs where chefs_timetable[i,j]=3) (1) >= chefs_needed[3,j]
        /\
        % Check half afternoon
        %sum(i in 1..num_employees where timetable[i,j]=4 \/ timetable[i,j]=5) (timetable[i,j]) >= needed[4,j]
        sum(i in 1..num_employees where chefs_timetable[i,j]=4 \/ chefs_timetable[i,j]=5) (1) >= chefs_needed[4,j]
%        let {
%            var float: tmp3 = sum(i in 1..num_chefs where chefs_timetable[i,j]=4) (chefs_timetable[i,j])/4
%        } in trace("d: " ++ show(tmp3) ++ "\n", 1=1) /\
%        let {
%            var float: tmp4 = sum(i in 1..num_chefs where chefs_timetable[i,j]=5) (chefs_timetable[i,j])/5
%        } in trace("d: " ++ show(tmp4) ++ "\n", 1=1) /\
%        tmp3 + tmp4 >= chefs_needed[4,j]
    ) /\
    % Checks that every employee works maximum 5 days    
    % Checks workers don't work more than their contract states
    forall(i in 1..num_chefs) (
        sum(j in 1..days where chefs_timetable[i,j] != 0) (1) <= work_days % = ?
        %/\
        %sum(j in 1..days) (working_hours[chefs_timetable[i,j]]) >= chefs_contract[i]
    )
;

% Waiters constraints
%constraint 
    % Checks if n employees are available when needed
    % Valid, doesn't take into account morning and afternoon shifts
    %forall(i in 1..num_employees, j in 1..days) (
    %    timetable[i,j] <= available[i,j]
    %) /\
    % Checks if n employees are available when needed
    % fm<-1 hm<-2,5 fa<-3 ha<-4,5
%    forall(j in 1..days) (
        % Check morning
%        sum(i in 1..num_waiters where waiters_timetable[i,j]=1) (waiters_timetable[i,j]) >= waiters_needed[1,j]
%        /\
        % Check half morning
        %sum(i in 1..num_employees where timetable[i,j]=2 \/ timetable[i,j]=5) (timetable[i,j]) >= needed[2,j]
%        let {
%            var float: tmp1 = sum(i in 1..num_waiters where waiters_timetable[i,j]=2) (waiters_timetable[i,j])/2
%        } in trace("d: " ++ show(tmp1) ++ "\n", 1=1) /\
%        let {
%            var float: tmp2 = sum(i in 1..num_waiters where waiters_timetable[i,j]=5) (waiters_timetable[i,j])/5
%        } in trace("d: " ++ show(tmp2) ++ "\n", 1=1) /\
%        tmp1 + tmp2 >= waiters_needed[2,j]
%        /\
        % Check afternoon
%        sum(i in 1..num_waiters where waiters_timetable[i,j]=3) (waiters_timetable[i,j])/3 >= waiters_needed[3,j]
%        /\
        % Check half afternoon
        %sum(i in 1..num_employees where timetable[i,j]=4 \/ timetable[i,j]=5) (timetable[i,j]) >= needed[4,j]
%        let {
%            var float: tmp3 = sum(i in 1..num_waiters where waiters_timetable[i,j]=4) (waiters_timetable[i,j])/4
%        } in trace("d: " ++ show(tmp3) ++ "\n", 1=1) /\
%        let {
%            var float: tmp4 = sum(i in 1..num_waiters where waiters_timetable[i,j]=5) (waiters_timetable[i,j])/5
%        } in trace("d: " ++ show(tmp4) ++ "\n", 1=1) /\
%        tmp3 + tmp4 >= waiters_needed[4,j]
%    ) /\
    % Checks that every employee works 5 days
    % Should be = but 2 employees work 3 days -> change to employement contract hours
%    forall(i in 1..num_waiters) (
%        sum(j in 1..days where waiters_timetable[i,j] != 0) (1) <= work_days
%    )
    % Checks workers don't work more than their contract states
%;

solve satisfy;
% solve minimize total_cost;

% Change normal solver -> search 
% -> particular combinatorial integer problems
% -> specify search strategy by annotations
% -> depth first search
%solve :: int_search(timetable, first_fail, indomain_min, complete) satisfy;

output [ 
    "chefs_needed     : " ++ show(chefs_needed) ++ "\n" ++
    "chefs_timetable  : " ++ show(chefs_timetable) ++ "\n" %++
%    "waiters_needed     : " ++ show(waiters_needed) ++ "\n" ++
%    "waiters_timetable  : " ++ show(waiters_timetable) ++ "\n" %++
]
    ++ ["\n"]
;





