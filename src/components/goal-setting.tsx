import React from "react";
import { Input, Textarea, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Goal {
  id: string;
  description: string;
  targetDate: string;
  measures: string;
}

interface GoalSettingProps {
  data: {
    goals: Goal[];
    developmentPlan: string;
    employeeComments: string;
    managerComments: string;
  };
  updateData: (data: Partial<GoalSettingProps["data"]>) => void;
}

export const GoalSetting: React.FC<GoalSettingProps> = ({ data, updateData }) => {
  const handleGoalChange = (index: number, field: keyof Goal, value: string) => {
    const updatedGoals = [...data.goals];
    updatedGoals[index] = {
      ...updatedGoals[index],
      [field]: value
    };
    updateData({ goals: updatedGoals });
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      description: "",
      targetDate: "",
      measures: ""
    };
    updateData({ goals: [...data.goals, newGoal] });
  };

  const removeGoal = (index: number) => {
    if (data.goals.length <= 1) return;
    const updatedGoals = [...data.goals];
    updatedGoals.splice(index, 1);
    updateData({ goals: updatedGoals });
  };

  const handleTextChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Performance Goals</h2>
        <p className="text-gray-600 mb-6">
          Set specific, measurable, achievable, relevant, and time-bound (SMART) goals for the next review period.
        </p>
        
        <div className="space-y-8">
          {data.goals.map((goal, index) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Goal {index + 1}</h3>
                {data.goals.length > 1 && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => removeGoal(index)}
                  >
                    <Icon icon="lucide:trash-2" className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                <Textarea
                  label="Goal Description"
                  placeholder="Describe the specific goal to be achieved"
                  value={goal.description}
                  onValueChange={(value) => handleGoalChange(index, "description", value)}
                />
               <br></br>
                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Completion Date
                  </label>
                  <Input
                    type="date"
                    placeholder="e.g., 2025-12-31"
                    value={goal.targetDate}
                    onValueChange={(value) => handleGoalChange(index, "targetDate", value)}
                    className="w-full"
                  />
                </div>
                
                <Textarea
                  label="Success Measures"
                  placeholder="How will success be measured for this goal?"
                  value={goal.measures}
                  onValueChange={(value) => handleGoalChange(index, "measures", value)}
                />
              </div>
              <br></br>
            </div>
          ))}
          
          <Button
            variant="flat"
            color="primary"
            startContent={<Icon icon="lucide:plus" className="w-4 h-4" />}
            onPress={addGoal}
          >
            Add Another Goal
          </Button>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Development Plan</h2>
        
        <Textarea
          label="Development Plan"
          placeholder="Outline specific actions, training, or resources needed to support the employee's growth"
          value={data.developmentPlan}
          onValueChange={(value) => handleTextChange("developmentPlan", value)}
          minRows={4}
        />
      </div>
      
      <div className="border-t border-gray-200 pt-6 space-y-6">
        <h2 className="text-xl font-semibold mb-4">Comments and Acknowledgement</h2>
        
        <Textarea
          label="Employee Comments"
          placeholder="Employee's comments about the appraisal and goals"
          value={data.employeeComments}
          onValueChange={(value) => handleTextChange("employeeComments", value)}
          minRows={3}
        />
        
        <Textarea
          label="Manager Comments"
          placeholder="Manager's final comments and feedback"
          value={data.managerComments}
          onValueChange={(value) => handleTextChange("managerComments", value)}
          minRows={3}
        />
      </div>
    </div>
  );
};