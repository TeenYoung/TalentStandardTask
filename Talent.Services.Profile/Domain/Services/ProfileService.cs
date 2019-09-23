using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Common.Security;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models;
using Talent.Services.Profile.Models.Profile;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            //Your code here;
            User profile = null;
            profile = (await _userRepository.GetByIdAsync(Id));

            var videoUrl = "";
            var cvUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);
                cvUrl = string.IsNullOrWhiteSpace(profile.CvName)
                          ? ""
                          : await _fileService.GetFileURL(profile.CvName, FileType.UserCV);

                var languages = profile.Languages.Select(x => ViewModelFromLanguage(x, profile.Id)).ToList();
                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();
                var educations = profile.Education.Select(x => ViewModelFromEducation(x)).ToList();
                var certifications = profile.Certifications.Select(x => ViewModelFromCertification(x)).ToList();
                var experience = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();

                var result = new TalentProfileViewModel
                {
                    Id = profile.Id,
                    FirstName = profile.FirstName,
                    MiddleName = profile.MiddleName,
                    LastName = profile.LastName,
                    Gender = profile.Gender,

                    Email = profile.Email,

                    Phone = profile.Phone,
                    MobilePhone = profile.MobilePhone,
                    IsMobilePhoneVerified = profile.IsMobilePhoneVerified,

                    Address = profile.Address,
                    Nationality = profile.Nationality,
                    VisaStatus = profile.VisaStatus,
                    VisaExpiryDate = profile.VisaExpiryDate,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,

                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    CvName = profile.CvName,
                    CvUrl = cvUrl,
                    Summary = profile.Summary,
                    Description = profile.Description,
                    LinkedAccounts = profile.LinkedAccounts,
                    JobSeekingStatus = profile.JobSeekingStatus,

                    Languages = languages,
                    Skills = skills,
                    Education = educations,
                    Certifications = certifications,
                    Experience = experience,

                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            //Your code here;
            try
            {
                if (model.Id != null)
                {
                    User existingUser = (await _userRepository.GetByIdAsync(model.Id));
                    existingUser.FirstName = model.FirstName;
                    existingUser.MiddleName = model.MiddleName;
                    existingUser.LastName = model.LastName;
                    existingUser.Gender = model.Gender;

                    existingUser.Email = model.Email;
                    existingUser.Phone = model.Phone;
                    existingUser.MobilePhone = model.MobilePhone;
                    existingUser.IsMobilePhoneVerified = model.IsMobilePhoneVerified;

                    existingUser.Address = model.Address;
                    existingUser.Nationality = model.Nationality;
                    existingUser.VisaStatus = model.VisaStatus;
                    existingUser.VisaExpiryDate = model.VisaExpiryDate;
                    existingUser.JobSeekingStatus = model.JobSeekingStatus;
                    existingUser.Summary = model.Summary;
                    existingUser.Description = model.Description;

                    existingUser.ProfilePhoto = model.ProfilePhoto;
                    existingUser.ProfilePhotoUrl = model.ProfilePhotoUrl;
                    existingUser.LinkedAccounts = model.LinkedAccounts;
                    existingUser.UpdatedBy = updaterId;
                    existingUser.UpdatedOn = DateTime.Now;

                    var newLanguages = new List<UserLanguage>();
                    foreach (var item in model.Languages)
                    {
                        var language = existingUser.Languages.SingleOrDefault(x => x.Id == item.Id);
                        if (language == null)
                        {
                            language = new UserLanguage
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateLanguageFromView(item, language);
                        newLanguages.Add(language);
                    }
                    existingUser.Languages = newLanguages;

                    var newSkills = new List<UserSkill>();
                    foreach (var item in model.Skills)
                    {
                        var skill = existingUser.Skills.SingleOrDefault(x => x.Id == item.Id);
                        if (skill == null)
                        {
                            skill = new UserSkill
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateSkillFromView(item, skill);
                        newSkills.Add(skill);
                    }
                    existingUser.Skills = newSkills;

                    var newEducation = new List<UserEducation>();
                    foreach (var item in model.Education)
                    {
                        var education = existingUser.Education.SingleOrDefault(x => x.Id == item.Id);
                        if (education == null)
                        {
                            education = new UserEducation
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateEducationFromView(item, education);
                        newEducation.Add(education);
                    }
                    existingUser.Education = newEducation;

                    var newCertifications = new List<UserCertification>();
                    foreach (var item in model.Certifications)
                    {
                        var certification = existingUser.Certifications.SingleOrDefault(x => x.Id == item.Id);
                        if (certification == null)
                        {
                            certification = new UserCertification
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false
                            };
                        }
                        UpdateCertificationFromView(item, certification);
                        newCertifications.Add(certification);
                    }
                    existingUser.Certifications = newCertifications;

                    var newExperience = new List<UserExperience>();
                    foreach (var item in model.Experience)
                    {
                        var experience = existingUser.Experience.SingleOrDefault(x => x.Id == item.Id);
                        if (experience == null)
                        {
                            experience = new UserExperience
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                            };
                        }
                        UpdateExperienceFromView(item, experience);
                        newExperience.Add(experience);
                    }
                    existingUser.Experience = newExperience;

                    await _userRepository.Update(existingUser);
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            //Your code here;
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            try
            {
                if (!forJob)
                {
                    var employerId = employerOrJobId;
                    var profile = await _employerRepository.GetByIdAsync(employerId);
                    var users = _userRepository.Collection.Skip(position).Take(increment).AsEnumerable();
                    if (profile != null)
                    {
                        var result = new List<TalentSnapshotViewModel>();

                        foreach (var user in users)
                        {
                            var skills = new List<string>();
                            foreach (var skill in user.Skills)
                            {
                                skills.Add(skill.Skill);
                            }

                            var newSnapshot = new TalentSnapshotViewModel();
                            newSnapshot.Id = user.Id;
                            newSnapshot.Name = user.FirstName + " " + user.LastName;
                            newSnapshot.PhotoId = user.ProfilePhotoUrl;
                            newSnapshot.VideoUrl = user.VideoName;
                            newSnapshot.CVUrl = user.CvName;
                            newSnapshot.Summary = user.Summary;
                            if (user.Experience.Count > 0)
                            {
                                newSnapshot.CurrentEmployment = user.Experience[0].Company;
                                newSnapshot.Level = user.Experience[0].Position;
                            }
                            newSnapshot.Visa = user.VisaStatus;
                            newSnapshot.Skills = skills;

                            result.Add(newSnapshot);
                        }
                        return result;
                    }
                    return null;
                }
                else
                {
                    throw new NotImplementedException();
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }

        protected void UpdateEducationFromView(AddEducationViewModel model, UserEducation original)
        {
            original.Country = model.Country;
            original.InstituteName = model.InstituteName;
            original.Title = model.Title;
            original.Degree = model.Degree;
            original.YearOfGraduation = model.YearOfGraduation;
        }

        protected void UpdateCertificationFromView(AddCertificationViewModel model, UserCertification original)
        {
            original.CertificationName = model.CertificationName;
            original.CertificationFrom = model.CertificationFrom;
            original.CertificationYear = model.CertificationYear;
        }

        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Company = model.Company;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Start = model.Start;
            original.End = model.End;
        }
        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language, string userId)
        {
            return new AddLanguageViewModel
            {
                Name = language.Language,
                Level = language.LanguageLevel,
                Id = language.Id,
                CurrentUserId = userId
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Country = education.Country,
                InstituteName = education.InstituteName,
                Title = education.Title,
                Degree = education.Degree,
                YearOfGraduation = education.YearOfGraduation,
                Id = education.Id
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationName = certification.CertificationName,
                CertificationFrom = certification.CertificationFrom,
                CertificationYear = certification.CertificationYear
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
