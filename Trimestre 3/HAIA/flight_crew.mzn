include "alldifferent.mzn";

int: C = 3; % crews
int: F = 11; % different flights
int: S = 12; % different sequences
array [1..C] of var 1..S: crews;
array[1..S] of int: costs = [2,3,4,6,7,5,7,8,9,9,8,9];

% Assign the 3 crews a different sequence of flights
constraint alldifferent(i in 1..C)(crews[i]);

% Verify the 11 flights are done by a selected sequence
% Flight 1 -> Sequence 1,4,7,10
constraint exists (i in 1..C) (crews[i] = 1 \/ crews[i] = 4 \/ crews[i] = 7 \/ crews[i] = 10);

% Flight 2 -> Sequence 2,5,8,11
constraint exists (i in 1..C) (crews[i] = 2 \/ crews[i] = 5 \/ crews[i] = 8 \/ crews[i] = 11);

% Flight 3 -> Sequence 3,6,9,12
constraint exists (i in 1..C) (crews[i] = 3 \/ crews[i] = 6  \/ crews[i] = 9 \/ crews[i] = 12);

% Flight 4 -> Sequence 4,7,9,10,12
constraint exists (i in 1..C) (crews[i] = 4 \/ crews[i] = 7 \/ crews[i] = 9 \/ crews[i] = 10 \/ crews[i] = 12);

% Flight 5 -> Sequence 1,6,10,11
constraint exists (i in 1..C) (crews[i] = 1 \/ crews[i] = 6 \/ crews[i] = 10 \/ crews[i] = 11);

% Flight 6 -> Sequence 4,5,9
constraint exists (i in 1..C) (crews[i] = 4 \/ crews[i] = 5 \/ crews[i] = 9);

% Flight 7 -> Sequence 7,8,10,11,12
constraint exists (i in 1..C) (crews[i] = 7 \/ crews[i] = 8 \/ crews[i] = 10 \/ crews[i] = 11 \/ crews[i] = 12);

% Flight 8 -> Sequence 2,4,5,9
constraint exists (i in 1..C) (crews[i] = 2 \/ crews[i] = 4 \/ crews[i] = 5 \/ crews[i] = 9);

% Flight 9 -> Sequence 5,8,11
constraint exists (i in 1..C) (crews[i] = 5 \/ crews[i] = 8 \/ crews[i] = 11);

% Flight 10 -> Sequence 3,7,8,12
constraint exists (i in 1..C) (crews[i] = 3 \/ crews[i] = 7 \/ crews[i] = 8 \/ crews[i] = 12);

% Flight 11 -> Sequence 6,9,10,11,12
constraint exists (i in 1..C) (crews[i] = 6 \/ crews[i] = 9 \/ crews[i] = 10 \/ crews[i] = 11 \/ crews[i] = 12);

% Minimize sum of costs
%solve satisfy;
solve minimize sum(i in 1..C)(costs[crews[i]]);

output["Crews: ", show(crews), "\n",
       "Cost: ", show((sum(i in 1..C)(costs[crews[i]]))*1000)];