using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;
using PollingApp.Services.Implementations;
using PollingApp.Repositories.Interfaces;
using PollingApp.Models.Entities;
using PollingApp.DTOs.Auth;

namespace PollingApp.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepo;
        private readonly IConfiguration _mockConfig;
        private readonly AuthService _authService;


        public AuthServiceTests()
        {
            _mockUserRepo = new Mock<IUserRepository>();

            var settings = new Dictionary<string, string>
            {
                {"Jwt:Key", "TEST_KEY_123456789_TEST_KEY_123456789"},
                {"Jwt:Issuer", "PollingApp"},
                {"Jwt:Audience", "PollingAppUsers"},
                {"Jwt:ExpiresInMinutes", "60"}
            };

            _mockConfig = new ConfigurationBuilder()
                .AddInMemoryCollection(settings!)
                .Build();

            _authService = new AuthService(_mockUserRepo.Object, _mockConfig);
        }


        //First I will be testing for the Register method
        [Fact]
        public async Task Register_Should_Throw_When_Password_Weak()
        {
            var dto = new RegisterDto
            {
                Name = "Sudhan",
                Email = "sudhan@gmail.com",
                Password = "abc123",
                Role = "Voter"
            };

            var ex = await Assert.ThrowsAsync<Exception>(() => _authService.RegisterAsync(dto));
            Assert.Equal("Password must have 8 chars, 1 upper, 1 lower, 1 digit, 1 special char.", ex.Message);
        }

        [Fact]
        public async Task Register_Should_Throw_When_Email_Already_Exists()
        {

            var dto = new RegisterDto
            {
                Name = "Sudhan",
                Email = "sudhan@gmail.com",
                Password = "Sudhan@123",
                Role = "Voter"
            };

            _mockUserRepo.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync(new User { Email = dto.Email });


            var ex = await Assert.ThrowsAsync<Exception>(() => _authService.RegisterAsync(dto));
            Assert.Equal("Email already registered", ex.Message);

        }

        [Fact]
        public async Task Register_Should_HashPassword_And_SaveUser()
        {

            var dto = new RegisterDto
            {
                Name = "Sudhan",
                Email = "sudhan@gmail.com",
                Password = "Sudhan@123",
                Role = "Voter"
            };

            _mockUserRepo.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync((User?)null);

            _mockUserRepo.Setup(r => r.AddUserAsync(It.IsAny<User>()))
                         .Returns(Task.CompletedTask);

            _mockUserRepo.Setup(r => r.SaveChangesAsync())
                         .ReturnsAsync(true);

            var result = await _authService.RegisterAsync(dto);

            Assert.NotNull(result.Token);
            _mockUserRepo.Verify(r => r.AddUserAsync(It.IsAny<User>()), Times.Once);

            Assert.NotEqual(dto.Password, result.Name);
        }

        [Fact]
        public async Task Register_Should_Return_Valid_Token()
        {

            var dto = new RegisterDto
            {
                Name = "Sudhan",
                Email = "sudhan@gmail.com",
                Password = "Sudhan@123",
                Role = "Voter"
            };

            _mockUserRepo.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync((User?)null);

            _mockUserRepo.Setup(r => r.AddUserAsync(It.IsAny<User>()))
                         .Returns(Task.CompletedTask);

            _mockUserRepo.Setup(r => r.SaveChangesAsync())
                         .ReturnsAsync(true);

            var result = await _authService.RegisterAsync(dto);

            Assert.False(string.IsNullOrWhiteSpace(result.Token));
        }

        // Next I will be testing for the Login method

        [Fact]
        public async Task Login_Should_Throw_When_User_Not_Found()
        {
            // Arrange
            var dto = new LoginDto
            {
                Email = "unknown@gmail.com",
                Password = "Unknown@123"
            };

            _mockUserRepo.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync((User?)null);

            // Act + Assert
            await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(dto));
        }

        [Fact]
        public async Task Login_Should_Throw_When_Password_Invalid()
        {

            var dto = new LoginDto
            {
                Email = "sudhan@gmail.com",
                Password = "Sudhan@123"
            };

            var user = new User
            {
                Id = 1,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Correct@123"),
                Role = "Voter"
            };

            _mockUserRepo.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync(user);

            await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(dto));
        }

        [Fact]
        public async Task Login_Should_Return_Valid_Token()
        {

            var dto = new LoginDto
            {
                Email = "sudhan@gmail.com",
                Password = "Sudhan@123"
            };

            var user = new User
            {
                Id = 1,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Admin",
                Name = "Sudhan"
            };

            _mockUserRepo.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync(user);

            var result = await _authService.LoginAsync(dto);

            Assert.NotNull(result);
            Assert.Equal("Admin", result.Role);
            Assert.False(string.IsNullOrWhiteSpace(result.Token));
        }

        [Fact]
        public async Task Login_Should_Return_Correct_User_Details()
        {

            var dto = new LoginDto
            {
                Email = "sudhan@gmail.com",
                Password = "Sudhan@123"
            };

            var user = new User
            {
                Id = 2,
                Name = "Sudhan",
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Voter"
            };

            _mockUserRepo.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync(user);

            var result = await _authService.LoginAsync(dto);

            Assert.Equal(2, result.UserId);
            Assert.Equal("Voter", result.Role);
            Assert.Equal("Sudhan", result.Name);
        }

    }
}
