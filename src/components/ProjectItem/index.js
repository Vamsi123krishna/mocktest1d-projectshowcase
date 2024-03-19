const ProjectItem = props => {
  const {eachProject} = props
  const {name, imageUrl} = eachProject
  return (
    <li>
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}

export default ProjectItem
