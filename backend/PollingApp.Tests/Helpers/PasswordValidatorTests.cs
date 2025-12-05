using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PollingApp.Services.Helpers;
using Xunit;

namespace PollingApp.Tests.Helpers
{
    public class PasswordValidatorTests
    {
        [Fact]
        public void CheckingPasswordStrength()
        {
            //3A pattern

            //Arrange
            string password = "Sudhan@123";

            //Act
            bool result = PasswordValidator.IsStrongPassword(password);

            //Assert
            Assert.True(result);
        }
    }
}
