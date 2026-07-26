import requests
from bs4 import BeautifulSoup
import json
from uoft_index_organized2 import scraped_data

course_codes = list(scraped_data.keys()) # get all course codes from the keys

# base URL for UTSC calendar
base_url = "https://utsc.calendar.utoronto.ca/course/"

def scrape_course(course_code):
    url = base_url + course_code.lower()  # construct full URL
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to fetch {course_code}: HTTP {response.status_code}")
        return None  # skip if page doesn't exist

    soup = BeautifulSoup(response.text, "html.parser")

    # extract course name & remove course code
    name_element = soup.select_one("h1.page-title")
    if name_element:
        name = name_element.text.strip()
        name = name[10:]  # take after first 9 characters (8 for code + ": ")
    else:
        name = "N/A"

    description_element = soup.select_one("article.node--type-courses div.field--name-body p")
    if description_element:
        description = description_element.text.strip()
    else:
        description = "N/A"

    course_data = {
        "code": course_code,
        "name": name,
        "description": description,
        "prereqs": soup.select_one("div.field--name-field-prerequisite .field__item").text.strip() if soup.select_one("div.field--name-field-prerequisite .field__item") else "N/A",
        "exclusions": soup.select_one("div.field--name-field-exclusion .field__item").text.strip() if soup.select_one("div.field--name-field-exclusion .field__item") else "N/A",
        "breadth": soup.select_one("div.field--name-field-breadth-requirements .field__item").text.strip() if soup.select_one("div.field--name-field-breadth-requirements .field__item") else "N/A",
        "notes": soup.select_one("div.field--name-field-note .field__item").text.strip() if soup.select_one("div.field--name-field-note .field__item") else "N/A",
        "timetable_link": soup.select_one("div.field--name-field-timetable-link a")["href"].strip() if soup.select_one("div.field--name-field-timetable-link a") else "N/A",
        "calendar_link": url
    }
    return course_data

# scrape all courses
all_courses = []
for code in course_codes:
    print(f"Scraping {code}...")
    course = scrape_course(code)
    if course:
        all_courses.append(course)

with open("course_info_all.json", "w") as f:
    json.dump(all_courses, f, indent=4)

print("Scraping complete! Data saved to course_info_all.json.")