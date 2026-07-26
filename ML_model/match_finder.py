import json

def load_json(file_name):
    try:
        with open(file_name, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: {file_name} not found.")
        exit()

def calculate_match_percentage(program, course):
    aspects = ["CoPr", "AnCr", "InCo", "RiFl", "NtLi"]
    total_match = 0

    for aspect in aspects:
        program_values = program[aspect]
        course_values = course[aspect]

        preferred_trait = max(program_values, key=program_values.get)
        preferred_program_value = program_values[preferred_trait]
        preferred_course_value = course_values[preferred_trait]

        match = 100 - abs(preferred_program_value - preferred_course_value)
        total_match += match

    return total_match / len(aspects)

def get_valid_program_name(programs):
    while True:
        user_input = input("Your program: ").strip().lower()
        for program_name in programs:
            if user_input == program_name.lower():
                return program_name
        print("Invalid. Try again:")

def main():
    program_nature = load_json("program_nature.json")
    course_nature = load_json("course_nature.json")

    print("Available programs:", ", ".join(program_nature.keys()))
    program_name = get_valid_program_name(program_nature)
    user_program = program_nature[program_name]

    matches = []
    for course_code, course_traits in course_nature.items():
        match_percentage = calculate_match_percentage(user_program, course_traits)
        matches.append((course_code, course_traits.get("name", "Unknown Course"), match_percentage))

    top_matches = sorted(matches, key=lambda x: x[2], reverse=True)

    print("\nCourse ranking based on match %:")
    for code, name, percentage in top_matches:
        print(f" {percentage:.2f}%: {code} - {name}")

if __name__ == "__main__":
    main()
