Table exercises {
  id integer [primary key]
  name varchar
  muscle varchar
  equipment varchar
  record_type varchar  // "weight_reps" | "reps" | "time"
  image_url varchar
}

Table workouts {
  id integer [primary key]
  name varchar
  description varchar
}

Table workout_exercises {
  id integer [primary key]
  workout_id integer [not null]    // links to workout template
  exercise_id integer [not null]   // exercise included in this workout
  order_index integer               // order of exercises in the workout
}

Table exercise_logs {
  id integer [primary key]
  exercise_id integer [not null]        // links to exercise performed
  reps integer
  weight float
  duration float
  workout_exercise_id integer [null]    // optional: link to the workout_exercises entry
  created_at timestamp
}

Ref: workout_exercises.workout_id > workouts.id
Ref: workout_exercises.exercise_id > exercises.id
Ref: exercise_logs.exercise_id > exercises.id
Ref: exercise_logs.workout_exercise_id > workout_exercises.id
