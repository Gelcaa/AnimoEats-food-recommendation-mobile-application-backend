class nutritionCalculations {
  static calculateTDEE(heightFeet, weightKg, age, gender, activityLevel) {
    const heightCm = heightFeet * 30.48;

    const bmr =
      gender === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    let tdee;
    switch (activityLevel) {
      case "sedentary":
        tdee = bmr * 1.2;
        break;
      case "light":
        tdee = bmr * 1.375;
        break;
      case "moderate":
        tdee = bmr * 1.55;
        break;
      case "active":
        tdee = bmr * 1.725;
        break;
      case "very active":
        tdee = bmr * 1.9;
        break;
      default:
        throw new Error("Invalid activity level");
    }

    return tdee;
  }

  static calculateBMI(weightKg, heightFeet) {
    const heightM = heightFeet * 0.3048; // Convert feet to meters
    return weightKg / (heightM * heightM); // BMI formula
  }

  static adjustCaloriesBasedOnBMI(bmi, tdee) {
    let adjustedCalories = tdee;
    let weightGoal;

    if (bmi < 18.5) {
      adjustedCalories += 500; // Suggest calories for weight gain
      weightGoal = "gain";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      weightGoal = "maintain"; // Maintain current calorie intake
    } else if (bmi >= 25 && bmi <= 29.9) {
      adjustedCalories -= 500; // Suggest calories for weight loss
      weightGoal = "lose";
    } else {
      adjustedCalories -= 1000; // Significant calorie reduction for obesity
      weightGoal = "lose";
    }

    return { adjustedCalories, weightGoal };
  }

  static calculateUserHealthProfile(tdeeData) {
    const tdee = this.calculateTDEE(
      tdeeData.heightFeet,
      tdeeData.weightKg,
      tdeeData.age,
      tdeeData.gender,
      tdeeData.activityLevel
    );

    const carbohydrateIntake =
      this.getCarbohydrateFactor(tdeeData.activityLevel) * tdeeData.weightKg;
    const fatIntake =
      this.getFatFactor(tdeeData.activityLevel) * tdeeData.weightKg;
    const proteinIntake =
      this.getProteinFactor(tdeeData.activityLevel) * tdeeData.weightKg;
    const fiberIntake = tdeeData.age + 5;
    const sodiumIntake = 2000;
    const sugarIntake = (0.1 * tdee) / 4;

    return {
      tdee,
      carbohydrate: carbohydrateIntake,
      fat: fatIntake,
      protein: proteinIntake,
      fiber: fiberIntake,
      sodium: sodiumIntake,
      sugar: sugarIntake,
    };
  }

  static getCarbohydrateFactor(activityLevel) {
    switch (activityLevel) {
      case "sedentary":
        return 3.0;
      case "light":
        return 3.5;
      case "moderate":
        return 4.0;
      case "active":
        return 4.5;
      case "very active":
        return 5.0;
      default:
        return 4.0;
    }
  }

  static getFatFactor(activityLevel) {
    switch (activityLevel) {
      case "sedentary":
        return 0.8;
      case "light":
        return 1.0;
      case "moderate":
        return 1.2;
      case "active":
        return 1.5;
      case "very active":
        return 1.8;
      default:
        return 1.2;
    }
  }

  static getProteinFactor(activityLevel) {
    switch (activityLevel) {
      case "sedentary":
        return 0.8;
      case "light":
        return 1.0;
      case "moderate":
        return 1.2;
      case "active":
        return 1.5;
      case "very active":
        return 1.8;
      default:
        return 1.2;
    }
  }
}

module.exports = nutritionCalculations;
