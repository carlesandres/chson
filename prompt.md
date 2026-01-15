I want to create a standard for writing software cheatsheets that allows developers to create 
and share cheatsheets for their software products.

The standard should be a JSON schema that can be used to ensure cheatsheets
remain consistent in their structure so that they can be easily parsed by many
different tools. The standaridaisation shoul dhelp build tools and systems that
can produce beautiful cheatsheets that can be consumed as searchable websites,
printable sheets, converted into study card decks and even combined into a
personalised databases of preferred cheats.

The basic of the standard is:

- A set of global fields that indicate:
- A title: indicating what software the cheatsheets is for
- A version (optional): ideally semver for indicating
- A publication date
- A description: a short summary of what the cheatsheet covers
- A non-standard matadata field: allowing for extensibility and custom fields.
- A sections array: containing the main content of the cheatsheet.
  - Each section should have:
   - A title
   - An optional description
   - An items array: containing the individual cheats.
    - Each item should have:
      - A title
      - A description
      - An optional comments field

The standard should allow for different types of use cases, such as:

- keyboard shortcuts
- code commands
- configuration options

What do you think is missing in this description? Do some research on projects
that have created schemas or standards that have become useful to the community.
