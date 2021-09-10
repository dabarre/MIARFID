include "alldifferent.mzn";

% Time modeled in hours eg. 1h = 1, 30m = 0.5
% Temporal plan

% Calcular a que hora llega un camión al cliente
% Output a que hora llega y se va de un cliente

int: P = 5; % parcels
int: MOVING_TIME = 0.5; % moving time from parcel x to parcel y
int: STARTING_TIME = 12.0;
int: ENDING_TIME = 20.0;
array[1..P] of int: delivery_time = [0.5,1.0,0.5,2.0,1.0];

array[1..P] of var STARTING_TIME..ENDING_TIME: delivery;

% Verify
% Parcel 1
constraint forall(i in 1..P where i!=1) ();

% Parcel 2

% Parcel 3

% Parcel 4

% Parcel 5

% Minimize sum of costs
solve satisfy;
%solve minimize sum(i in 1..C)(costs[crews[i]]);



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

output["Crews: ", show(crews), "\n",
       "Cost: ", show((sum(i in 1..C)(costs[crews[i]]))*1000)];