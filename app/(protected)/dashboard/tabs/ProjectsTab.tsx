import { DndContext, closestCenter, DragEndEvent, SensorDescriptor, SensorOptions } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectForm } from "@/components/ProjectForm";
import type { Project } from "@/db/schema/schema";

interface ProjectsTabProps {
  projects: Project[];
  sensors: SensorDescriptor<SensorOptions>[];
  handleProjectDragEnd: (event: DragEndEvent) => void;
  handleProjectUpdated: (updatedProject: Project) => void;
  handleProjectDeleted: (id: string) => void;
  handleProjectAdded: (newProject: Project) => void;
}

export function ProjectsTab({
  projects,
  sensors,
  handleProjectDragEnd,
  handleProjectUpdated,
  handleProjectDeleted,
  handleProjectAdded,
}: ProjectsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Featured Projects</h2>
        <span className="text-xs font-mono text-muted-foreground bg-foreground/5 px-2 py-1 rounded-md border border-border/40">
          {projects.length} Projects
        </span>
      </div>

      <DndContext id="projects-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjectDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onUpdate={handleProjectUpdated} onDelete={handleProjectDeleted} />
            ))}
            {projects.length === 0 && (
              <div className="py-12 text-center border border-dashed border-border/40 rounded-xl bg-card/10">
                <p className="text-muted-foreground/60 text-sm normal-case font-medium">No projects added yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 pt-6 border-t border-border/40">
        <h3 className="text-sm font-medium text-foreground mb-4 normal-case">Add New Project</h3>
        <ProjectForm onProjectAdded={handleProjectAdded} />
      </div>
    </div>
  );
}
