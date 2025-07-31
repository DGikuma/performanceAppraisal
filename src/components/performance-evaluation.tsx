import React from "react";
import { Slider, Textarea } from "@heroui/react";

const performanceCriteria = [
  { id: "jobKnowledge", label: "Job Knowledge", description: "Understanding of job-related skills, procedures, and information" },
  { id: "workQuality", label: "Work Quality", description: "Accuracy, thoroughness, and effectiveness of work" },
  { id: "productivity", label: "Productivity", description: "Volume of work, efficiency, and meeting deadlines" },
  { id: "communication", label: "Communication", description: "Clarity, effectiveness, and appropriateness of communication" },
  { id: "teamwork", label: "Teamwork", description: "Cooperation, collaboration, and relationship building" },
  { id: "problemSolving", label: "Problem Solving", description: "Identifying issues and implementing effective solutions" },
  { id: "initiative", label: "Initiative", description: "Self-motivation, proactivity, and willingness to take on responsibilities" },
  { id: "adaptability", label: "Adaptability", description: "Flexibility and ability to adjust to changing conditions" },
] as const;

type PerformanceCriterionId = typeof performanceCriteria[number]['id'];

type PerformanceData = {
  [K in PerformanceCriterionId]: number;
} & {
  strengths: string;
  areasForImprovement: string;
  overallRating: number;
  comments: string;
};

interface PerformanceEvaluationProps {
  data: PerformanceData;
  updateData: (data: Partial<PerformanceData>) => void;
}

export const PerformanceEvaluation: React.FC<PerformanceEvaluationProps> = ({ data, updateData }) => {

  const getRatingLabel = (value: number) => {
    switch (value) {
      case 1: return "Poor";
      case 2: return "Below Expectations";
      case 3: return "Meets Expectations";
      case 4: return "Exceeds Expectations";
      case 5: return "Outstanding";
      default: return "Not Rated";
    }
  };

  const getRatingColor = (value: number) => {
    switch (value) {
      case 1: return "text-red-500";
      case 2: return "text-orange-500";
      case 3: return "text-blue-500";
      case 4: return "text-indigo-500";
      case 5: return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const handleSliderChange = (id: PerformanceCriterionId, value: number[]) => {
    updateData({ [id]: value[0] });
  };

  const handleTextChange = (id: 'strengths' | 'areasForImprovement' | 'comments', value: string) => {
    updateData({ [id]: value });
  };

  const calculateOverallRating = React.useCallback(() => {
    const ratings = performanceCriteria.map(criterion => data[criterion.id]);
    const validRatings = ratings.filter(rating => rating > 0);
    if (validRatings.length === 0) return 0;
    
    const sum = validRatings.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / validRatings.length) * 10) / 10;
  }, [data]);

  React.useEffect(() => {
    const overallRating = calculateOverallRating();
    if (overallRating !== data.overallRating) {
      updateData({ overallRating });
    }
  }, [data, data.overallRating, updateData, calculateOverallRating]);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Performance Evaluation</h2>
      
      <div className="space-y-8">
        {performanceCriteria.map((criterion) => (
          <div key={criterion.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{criterion.label}</h3>
                <p className="text-sm text-gray-500">{criterion.description}</p>
              </div>
              <div className={`font-medium ${getRatingColor(data[criterion.id])}`}>
                {getRatingLabel(data[criterion.id])}
              </div>
            </div>
            
            <Slider
              label="Rating"
              step={1}
              minValue={1}
              maxValue={5}
              value={[data[criterion.id] || 1]}
              className="max-w-md"
              getValue={(value) => getRatingLabel(Array.isArray(value) ? value[0] : value)}
              onChange={(value) => handleSliderChange(criterion.id, value as number[])}
              marks={[
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
              ]}
            />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Overall Performance Rating</h3>
          <div className="text-xl font-semibold">
            {data.overallRating > 0 ? data.overallRating.toFixed(1) : "N/A"}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className={`bg-blue-600 h-2.5 rounded-full`}
            style={{ width: `${data.overallRating > 0 ? (data.overallRating / 5) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        <Textarea
          label="Key Strengths"
          placeholder="Describe the employee's key strengths and accomplishments"
          value={data.strengths}
          onValueChange={(value) => handleTextChange("strengths", value)}
          minRows={3}
        />
        
        <Textarea
          label="Areas for Improvement"
          placeholder="Identify areas where the employee can improve"
          value={data.areasForImprovement}
          onValueChange={(value) => handleTextChange("areasForImprovement", value)}
          minRows={3}
        />
        
        <Textarea
          label="Additional Comments"
          placeholder="Any additional feedback or comments about the employee's performance"
          value={data.comments}
          onValueChange={(value) => handleTextChange("comments", value)}
          minRows={3}
        />
      </div>
    </div>
  );
};