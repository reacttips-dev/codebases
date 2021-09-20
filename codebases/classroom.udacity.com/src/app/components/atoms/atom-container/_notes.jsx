import InstructorNotes from 'components/common/instructor-notes';

var Notes = ({ atom }) => {
  return (
    <div>
      <InstructorNotes notes={atom.instructor_notes} />
    </div>
  );
};
Notes.displayName = 'atoms/atom-container/_notes';

export default Notes;
