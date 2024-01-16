# TaggedNoteBook Laravel Project Instructions

## Project Overview

Create a new Laravel project for `TaggedNoteBook`. The goal is to build an application that allows users to create and manage notes with automatic tagging.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Requirements

### 1. CRUD Operations

Implement the basic CRUD operations for managing notes.

- **Create:** Users should be able to create a new note with a title, description, and a cover photo.
- **Read:** Display a list of all notes, and allow users to view the details of each note.
- **Update:** Users should be able to edit the title, description, and cover photo of an existing note.
- **Delete:** Allow users to delete a note.

### 2. Note Properties

Each note should have the following properties:

- **Title:** Required field.
- **Description:** Required field.
- **Cover Photo:** Required field with a dimension of 9:16, and max 1024 KB.

### 3. Logic based on Note Content

#### Logic Testing Criteria: Tagging System

Implement a tagging system that automatically assigns tags to notes based on specific keywords found in the title or description. This will add a layer of organization to the notes and showcase your ability to implement logic based on content.

##### Requirements

- **Tagging Logic:**
  - Define a set of keywords that will be used to determine the tags in the settings page.
  - Implement a logic that scans the title and description of a note for these keywords.
  - If a keyword is found, assign the corresponding tag to the note.

- **Tag Display:**
  - Display the assigned tags for each note in the list view and individual note view.

- **Tag Filtering:**
  - Allow users to filter notes based on tags in the list view.

##### Example:

Let's say you have the following keywords and corresponding tags:

- Keyword: "work" -> Tag: "Work"
- Keyword: "personal" -> Tag: "Personal"
- Keyword: "urgent" -> Tag: "Urgent"

If a note has the word "work" in its title or description, it should automatically be tagged as "Work." Similarly, for "personal" and "urgent."

##### Evaluation:

Your implementation will be evaluated based on:

- **Correctness:** Tags should be assigned accurately based on the presence of keywords.
- **Flexibility:** The system should be easily extensible to accommodate additional keywords and tags.
- **User Interface:** Tags should be displayed appropriately in the UI, and the filtering functionality should work seamlessly.

## Submission Requirements

1. Push the code to a publicly accessible GitHub repository.
2. Share the link to the GitHub repository.

## Evaluation Criteria

Your project will be evaluated based on:

- **Functionality:** Does the project meet the specified requirements?
- **Code Quality:** Is the code well-structured, readable, and maintainable?
- **Creativity:** How well did you implement the additional logic based on the notes' content?

Good luck! If you have any questions, feel free to reach out.

**Note:** The design of the UI is at your discretion; however, ensure it is user-friendly and enhances the overall user experience.
